# AQUASTONE Hybrid Visual System

The Hero renders complete, precomputed scene states. Each of the six product systems has one desktop and one mobile AVIF atlas containing nine material states in a fixed horizontal order.

Runtime responsibilities are limited to selecting a frame, decoding the destination system atlas before committing a system change, cross-fading complete states, preloading the adjacent system while idle, and respecting reduced-motion preferences.

Runtime material projection, masks, generic clip-path replacement, relighting, UV reconstruction and full-room real-time 3D are explicitly excluded. React Three Fiber remains reserved for simple product geometry, layer construction, installation details and future AR-compatible models.

The packed AQV1 source bundle is verified by byte length and SHA-256 before extraction. Every extracted AVIF is independently verified before it is written to the generated public asset directory.
