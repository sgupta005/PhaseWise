export interface ChatMessageResponse {
  _id: string;
  content: string;
  sender: {
    _id: string;
    name: string;
    email: string;
    image: string | null;
  };
  createdAt: string;
}
