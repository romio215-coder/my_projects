
export interface Comic {
  id: string;
  title: string;
  desc: string;
  img: string;
  rating?: number;
  author: string;
  date: string;
  category: string;
}

export interface Comment {
  id: string;
  author: string;
  avatar: string;
  text: string;
  time: string;
  likes: number;
}
