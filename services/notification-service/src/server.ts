import app from './index';
import { logger } from '../../../utils';

const PORT = process.env.PORT || 5003;

app.listen(PORT, () => {
  logger.info({ 
    type: 'server_start', 
    service: 'notification-service', 
    port: PORT 
  });
  console.log(`🚀 Notification Service running on http://localhost:${PORT}`);
});