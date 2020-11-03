import { User } from './user';

export class Message {
    public id: number;
    public body: string;
    public sender: User;
    public recipient: User;
    public image: string;
    public createdData: any;
    public deleted: boolean;
    public updated: boolean;
}