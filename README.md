![export file process](https://github.com/shivams112/Atlan-backend-challenge/blob/master/images/atlan.png) <br />

# Atlan Backend Internship Task -
## API calls :-
### 1). POST /upload
Body (in form-data format): file <br/>
#### Example : <br/>
```POST method : <baseURL>/upload``` <br/>
Body : <br/>
file : <selected_file> <br/>
#### Result : <br/>
Success message when upload finishes. Abort message when upload terminate is called. <br/>
#### Description : <br/>
Uploaded file stays in the Temp folder of the system until it completely 
uploads. After completion, it is copied to ‘Uploads’ folder in the root
directory of the application. <br/>

### 2). DELETE /upload/terminate
#### Example : <br/>
```DELETE method : <baseURL>/upload/terminate``` <br/>
#### Result : <br/>
Success message on successful termination. Otherwise, the reason for
failure of termination is returned. <br/>
#### Description : <br/>
Terminates the file Upload by the user if he/she is currently uploading.
Otherwise sends a message that they are not uploading anything
currently. <br/>

### 3). POST /export
Headers: Content-Type <br/>
Body (in JSON format) : “filename” <br/>
#### Example : <br/>
```POST method : <baseURL>/export``` <br/>
Headers: <br/>
auth_token:
Application/json<br/>
Body : <br/>
“filename” : <file_name> <br/>
#### Result : <br/>
Success on complete file export. If terminated, a message is sent that the
export is terminated. <br/>
#### Description : <br/>
Exports the requested file (if it exists in the “Uploads” folder). <br/>
### 4). POST /export/terminate
#### Example : <br/>
```POST method : <baseURL>/export/terminate``` <br/>
#### Result : <br/>
Success on successful export termination(If the user is exporting).
Otherwise, a message is sent stating that the user is not currently
exporting any file. <br/>
#### Description : <br/>
Terminates the file export that the user requested. <br/>

## Approach :-

### 1). File Uploads :
● Create a Job Queue that contains all the instances of forms that are currently being parsed. <br/>
● Job queue is an unique string which is created using UUID. <br/>
● Whenever an upload event is triggered, we head straight to that instance and handle the event. <br/>
● When data is being uploaded, “data” event is triggered and the
form is parsed normally. Finally, when whole data is parsed, store
the file into ‘Uploads’ directory (initially it is in OS’s Temp directory). <br/>
● When there is a request to abort, “abort” event is triggered and the
form is stopped from parsing further. Also, this instance is deleted
from the Job queue, since it is terminated. <br/>
### 2). File Exports :
● Create a Job Queue that contains all dataStreams (read streams). <br/>
● Job queue is an unique string which is created using UUID. <br/>
● Listen to events and handle them. <br/>
● When file ‘abort’ is triggered, destroy the stream and delete the
dataStream instance in Job queue because it is no longer required. <br/>
