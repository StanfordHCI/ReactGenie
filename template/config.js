import Constants from 'expo-constants';
import 'dotenv/config'

const ENV = {
  OPENAI_API_KEY: Constants.manifest.extra.OPENAI_API_KEY,
  OPENAI_API_BASE_URL: Constants.manifest.extra.OPENAI_API_BASE_URL,
  AZURE_SPEECH_REGION: Constants.manifest.extra.AZURE_SPEECH_REGION,
  AZURE_SPEECH_KEY: Constants.manifest.extra.AZURE_SPEECH_KEY,
};

export default ENV;
