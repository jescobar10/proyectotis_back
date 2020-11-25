
export interface FileUpload{
    name: string;
    data:any;
    size: Number;
    encoding: string;
    tempFilePath: string;
    truncated: boolean;
    mimetype: string;    


    mv: Function;

}