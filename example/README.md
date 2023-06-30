To test, run:

```bash
if [ -d "../node_modules/reactgenie-lib" ]; then rm -r ../node_modules/reactgenie-lib; fi && npm install --install-links && npx expo start --web
```

Don't forget to put your credentials into the `.env` file, see `.env.example` for reference.
