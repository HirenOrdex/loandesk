import { persistStore } from 'redux-persist';
import store from './store';

const storePersistor = persistStore(store);

export default storePersistor; // Default export