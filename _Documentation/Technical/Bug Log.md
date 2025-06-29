


# Build Compilation


Error Log:
```
0] ERROR in main.js
[0] main.js from Terser plugin
[0] Unexpected token: punc ([) [webpack://./node_modules/undici/lib/handler/unwrap-handler.js:14,0][main.js:12218,2]
[0]     at js_error (D:\Programming\Major Projects\Music Player\node_modules\terser\dist\bundle.min.js:536:11)
[0]     at croak (D:\Programming\Major Projects\Music Player\node_modules\terser\dist\bundle.min.js:1264:9)
[0]     at token_error (D:\Programming\Major Projects\Music Player\node_modules\terser\dist\bundle.min.js:1272:9)
[0]     at unexpected (D:\Programming\Major Projects\Music Player\node_modules\terser\dist\bundle.min.js:1278:9)
[0]     at class_ (D:\Programming\Major Projects\Music Player\node_modules\terser\dist\bundle.min.js:2697:28)
[0]     at statement (D:\Programming\Major Projects\Music Player\node_modules\terser\dist\bundle.min.js:1456:24)
[0]     at _embed_tokens_wrapper (D:\Programming\Major Projects\Music Player\node_modules\terser\dist\bundle.min.js:1329:26)
[0]     at block_ (D:\Programming\Major Projects\Music Player\node_modules\terser\dist\bundle.min.js:2168:20)
[0]     at _function_body (D:\Programming\Major Projects\Music Player\node_modules\terser\dist\bundle.min.js:2080:21)
[0]     at arrow_function (D:\Programming\Major Projects\Music Player\node_modules\terser\dist\bundle.min.js:1686:20)
[0]
[0] webpack compiled with 1 error
[0] npm run build:main exited with code 1
[1] npm run build:renderer exited with code 0
```

Cause: Cheerio requires the use of undici, undici cannot be properly complied in production using default electron boilerplate setup.

Fix: 
- Do not minimize the build as seen in follow png in webpack.config.main.prod
![[Pasted image 20250625105332.png]]

Note: 
- As of 2025-06-25: Cheerio was not used in any production feature, therefore unknown if fix actually allows cheerio to still function despite successful compilation






![[Pasted image 20250627180045.png]]

Cause: Seeking through a song with repeated lyrics will cause duplicated elements to appear
(likely same problem outlined here: https://stackoverflow.com/questions/72204470/react-updating-state-creates-duplicate-element-in-dom-but-state-updates-correctl)

Fix: 
- Not yet fixed






Issue:
- If discord is closed while application is running, RPC CLI will also close; It should not do that, instead it should attempt to reconnect to discord periodically





# Performance

- Large Performance Issues when using rpc cli
![[Pasted image 20250628155250.png]]

Fix:
- Don't allow main loop to execute every possible frame 

            clientController.UpdateMethod();
            System.Threading.Thread.Sleep(50);
