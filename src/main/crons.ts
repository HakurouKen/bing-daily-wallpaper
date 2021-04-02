import schedule from 'node-schedule';
import { isValidCron } from 'cron-validator';

let job: schedule.Job | null = null;

function cancel() {
  if (job) {
    job.cancel();
    job = null;
  }
}

function setup(timeExpression: string, func: () => void) {
  const cronExpression = normalizeCronExpression(timeExpression);
  if (!isValidCron(cronExpression)) {
    throw new Error(`Invalid cron expression: ${cronExpression}`);
  }
  if (job) {
    job.reschedule(cronExpression);
  } else {
    job = schedule.scheduleJob(cronExpression, func);
  }
  return;
}

/**
 * 兼容 crontab 时间格式和 HH:mm 时间
 * @param expression 时间字符串
 * @returns cron 时间字符串
 */
function normalizeCronExpression(expression: string) {
  if (/^\d+\s*:\s*\d+$/.test(expression.trim())) {
    const [h, m] = expression.split(':');
    return `${parseInt(m, 10)} ${parseInt(h, 10)} * * *`;
  }
  return expression;
}

export { setup, cancel };
