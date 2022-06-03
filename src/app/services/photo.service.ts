import { Injectable } from '@angular/core';
import { Camera, CameraResultType, Photo } from '@capacitor/camera';
import { StorageService } from './storage.service';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})


// I have very little understanding on how this code works,
// I just copied it from the Ionic Docs and modified it to work with a single image
// instead of an array of images.
// All comments in this class are also from the Ionic Docs.
export class PhotoService {

  public profile_picture;
  private PHOTO_STORAGE: string = 'profile_picture';
  
  constructor(private storage:StorageService, private http:HttpClient) { }

  public takePicture = async () => {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: true,
      resultType: CameraResultType.Uri
    });
  
    // image.webPath will contain a path that can be set as an image src.
    // You can access the original file using image.path, which can be
    // passed to the Filesystem API to read the raw data of the image,
    // if desired (or pass resultType: CameraResultType.Base64 to getPhoto)
    var imageUrl = image.webPath;
  
    // Can be set to the src of an image now
    this.profile_picture = {filepath: "soon", webviewPath: image.webPath};

    const savedImageFile = await this.savePicture(image)
    this.profile_picture = savedImageFile;
    this.storage.set("profile_picture", this.profile_picture);
  };

  private async savePicture(photo:any) {
    // Convert photo to base64 format, required by Filesystem API to save
    const base64Data = await this.readAsBase64(photo);

    // Write the file to the data directory
    const fileName = new Date().getTime() + '.jpeg';
    const savedFile = await Filesystem.writeFile({
      path: fileName,
      data: base64Data,
      directory: Directory.Data
    });

    // Use webPath to display the new image instead of base64 since it's
    // already loaded into memory
    return {
      filepath: fileName,
      webviewPath: photo.webPath
    };
  }

  private async readAsBase64(photo: Photo) {
    // Fetch the photo, read as a blob, then convert to base64 format
    const response = await fetch(photo.webPath!);
    const blob = await response.blob();
  
    return await this.convertBlobToBase64(blob) as string;
  }

  private convertBlobToBase64 = (blob: Blob) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
        resolve(reader.result);
    };
    reader.readAsDataURL(blob);
  });

  public async loadSaved() {

    // Retrieve cached photo
    const photoList = await this.storage.get("profile_picture");
    this.profile_picture = await this.storage.get("profile_picture");
    
    if (this.profile_picture != null) {
      // Read saved photo's data from the Filesystem
      const readFile = await Filesystem.readFile({
        path: this.profile_picture.filepath,
        directory: Directory.Data,
      });
      // Web platform only: Load the photo as base64 data
      this.profile_picture.webviewPath = `data:image/jpeg;base64,${readFile.data}`;
    }

  }

}

export interface UserPhoto {
  filepath: string;
  webviewPath: string;
}
