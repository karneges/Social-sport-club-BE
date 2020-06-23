import path from "path";
import ErrorHandler from "./errorHandler";
import {Request  as ReqExpress} from 'express'
import {Model} from "mongoose";
import {UploadedFile} from "express-fileupload";


export const fileUploadFunction = (req: Request | ReqExpress, model: Model<any> ,id:string): Promise<any> => {

  const url = (req as ReqExpress).protocol + '://' + (req as ReqExpress).get('host')
  //find and naming file
  const random = Math.round(Math.random()*100000000)
  const file = req.files?.image as UploadedFile
  file.name = `image_${random}${id}${path.parse(file.name).ext}`;
  //construct path
  const pathNorm = path.join(__dirname, '../', '../', 'static','/images', '/', `${file.name}`)
  // move files and update Model
  return new Promise( (resolve, reject) => {
    file.mv(`${pathNorm}`,  async (err: any) => {
      if (err) {
        console.error(err);
        return reject(new ErrorHandler(`Problem with file`, 500))
      } else {
      // @ts-ignore
        const updateObj = await model.findByIdAndUpdate(id, {image: `${url}/images/${file.name}`}, {
          runValidators: true,
          new: true
        }) as PostInMongo;
        return resolve(updateObj)
      }
    })
  })

}
