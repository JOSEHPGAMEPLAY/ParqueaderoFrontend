export interface Author {
  _id: string;
  username: string;
}

export interface Comment {
  _id: string;
  message: string;
  author: Author;
  createdAt: string;
  updatedAt: string;
}



export interface AddOrEditCommentProps {
    isOpen: boolean;
    onClose: () => void;
    comment: string;
    onCommentChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onCreate: () => void;
    isEdit?: boolean;
}