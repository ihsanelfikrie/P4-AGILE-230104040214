import app from './index';

import { logger } from '../../../utils';

const PORT = process.env.PORT || 5002;

app.listen(PORT, () => {
  logger.info({ 
    type: 'server_start', 
    service: 'order-service', 
    port: PORT 
  });
  console.log(`🚀 Order Service running on http://localhost:${PORT}`);
});
