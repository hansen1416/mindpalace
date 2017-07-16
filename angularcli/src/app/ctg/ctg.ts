/**
 * Created by hlz on 16-11-21.
 */
export class Ctg {
    ctg_id: number;
    pid: number;
    space_id: number;
    tier: number;
    sort: number;
    path: string;
    ctg: {
        ctg_id: number;
        user_id: number;
        title: string;
        updated_at: string;
        created_at: string;
    }
}