import { User } from './user';

export class Post {
    public id: number;
    public body: string;
    public owner: User;
    public commentary: boolean;
    public image: string;
    public likes: User[];
    public totalLikes: number;
    public totalCommentaries: number;
    public createdData: any;
}