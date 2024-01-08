import { SendExampleEvent } from '@/event/events/examples';

export const makeSendExampleEvent = () => {
  return new SendExampleEvent();
};
