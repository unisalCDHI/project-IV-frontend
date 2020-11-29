import { Post } from './post';
import { User } from './user';

export class Team {
    id: number;
    name: string;
    owner: User;
    members: User[];
    about: string;
    posts: Post[];
}