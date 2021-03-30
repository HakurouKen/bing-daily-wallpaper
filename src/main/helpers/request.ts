import axios from 'axios';
import HttpsProxyAgent from 'https-proxy-agent';

const proxy =
  process.env.http_proxy || process.env.https_proxy || process.env.HTTPS_PROXY;

const instance = proxy
  ? axios.create({
      proxy: false,
      // @ts-ignore
      httpsAgent: new HttpsProxyAgent(proxy)
    })
  : axios;

export default instance;
