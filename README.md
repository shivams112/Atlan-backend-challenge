    [![Gitpod Ready-to-Code](https://img.shields.io/badge/Gitpod-Ready--to--Code-blue?logo=gitpod)](https://gitpod.io/#https://github.com/Utkal97/backend-altan) 

    [![Gitpod Ready-to-Code](https://img.shields.io/badge/Gitpod-Ready--to--Code-blue?logo=gitpod)](https://gitpod.io/#https://github.com/Utkal97/backend-altan) 

    # Atlan Backend Internship Task -

    ## API calls :-
    
    ### 1). POST /upload
    Body (in form-data format): file 
    #### Example : 
    ```POST method : <baseURL>/upload``` 
    Form-data
    Body : 
    file : <selected_file> 
    #### Result : 
    Success message when upload finishes. Abort message when upload terminate is called. 
    #### Description : 
    Uploaded file stays in the Temp folder of the system until it completely 
    uploads. After completion, it is copied to ‘Uploads’ folder in the root
    directory of the application. <br/>

    ### 2). DELETE /upload/terminate

    #### Example : 
    ```DELETE method : <baseURL>/upload/terminate``` 

    #### Result : 
    Success message on successful termination. Otherwise, the reason for
    failure of termination is returned. 
    #### Description : <br/>
    Terminates the file Upload by the user if he/she is currently uploading.
    Otherwise sends a message that they are not uploading anything
    currently. 

    ### 3). POST /export
    Headers: Content-Type 
    Body (in JSON format) : “filename” 
    #### Example : 
    ```POST method : <baseURL>/export``` 
    Headers: 
    Content-Type: Application/json 
    Body : 
    “filename” : <file_name> 
    #### Result : 
    Success on complete file export. If terminated, a message is sent that the
    export is terminated. 
    #### Description : 
    Exports the requested file (if it exists in the “Uploads” folder). 
    ### 5). POST /export/terminate

    #### Example : 
    ```POST method : <baseURL>/export/terminate``` 

    #### Result : 
    Success on successful export termination(If the user is exporting).
    Otherwise, a message is sent stating that the user is not currently
    exporting any file. 
    #### Description : 
    Terminates the file export that the user requested. 

    ## Approach :-

    ### 1). File Uploads :
    ● Create a Job Queue that contains all the instances of forms that are currently being parsed. 
    ● Job queue is an unique string which is created using UUID.
    ● Whenever an upload event is triggered, we head straight to that instance and handle the event. 
    ● When data is being uploaded, “data” event is triggered and the
    form is parsed normally. Finally, when whole data is parsed, store
    the file into ‘Uploads’ directory (initially it is in OS’s Temp directory). 
    ● When there is a request to abort, “abort” event is triggered and the
    form is stopped from parsing further. Also, this instance is deleted
    from the Job queue, since it is terminated. 
    ### 2). File Exports :
    ● Create a Job Queue that contains all dataStreams (read streams). 
    ● Job queue is an unique string which is created using UUID.
    ● Listen to events and handle them. 
    ● When file ‘abort’ is triggered, destroy the stream and delete the
    dataStream instance in Job queue because it is no longer required. 
