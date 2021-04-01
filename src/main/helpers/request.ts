import axios from 'axios';
import createHttpsProxyAgent from 'https-proxy-agent';

const proxy =
  process.env.http_proxy || process.env.https_proxy || process.env.HTTPS_PROXY;

const instance = proxy
  ? axios.create({
      proxy: false,
      httpsAgent: createHttpsProxyAgent(proxy)
    })
  : axios;

export default instance;
