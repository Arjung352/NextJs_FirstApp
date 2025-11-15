import { Message } from "../model/Message";
export interface ApiResponse {
  success: boolean;
  message: string;
  isAcceptingMassage?: boolean;
  messages?: Array<Message>;
}
