import axios from 'axios';
import { URL } from '../utils/utils';

const api = axios.create({
  baseURL: URL,
});

export default api;
