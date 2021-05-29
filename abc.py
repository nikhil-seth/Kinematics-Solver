def TalkingHeadsAttention (
X[n, d_X ], # n vectors with dimensionality d_X
M[m, d_M ], # m vectors with dimensionality d_M
P_q [d_X , d_k , h_k ], # learned linear projection to produce queries
P_k [d_M , d_k , h_k ], # learned linear projection to produce keys
P_v [d_M , d_v , h_v ], # learned linear projection to produce values
P_o [d_Y , d_v , h_v ], # learned linear projection of output
P_l [h_k , h], # talking - heads projection for logits
P_w [h, h_v ]): # talking - heads projection for weights
Q[n, d_k , h_k] = einsum (X[n, d_X ], P_q [d_X , d_k , h_k ]) # queries n* d_X * d_k *h_k
K[m, d_k , h_k] = einsum (M[m, d_M ], P_k [d_M , d_k , h_k ]) # keys m* d_M * d_k *h_k
V[m, d_v , h_v] = einsum (M[m, d_M ], P_v [d_M , d_v , h_v ]) # values m* d_M * d_v * h_v
J[n, m, h_k ] = einsum (Q[n, d_k , h_k ], K[m, d_k , h_k ]) # dot prod . n*m* d_k *h_k
L[n, m, h] = einsum (J[n, m, h_k ], P_l [h_k , h]) # Talking - heads proj . n*m*h* h_k
W[n, m, h] = softmax (L[n, m, h], reduced_dim =m) # Attention weights
U[n, m, h_v ] = einsum (W[n, m, h], P_w [h, h_v ]) # Talking - heads proj . n*m*h* h_v
O[n, d_v , h_v] = einsum (U[n, m, h_v ], V[m, d_v , h_v ]) # n*m* d_v * h_v
Y[n, d_Y ] = einsum (O[n, d_v , h_v ], P_o [d_Y , d_v , h_v ]) # n* d_Y * d_v * h_v
return Y[n, d_Y ]
