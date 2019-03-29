# sardonyx-server
サードニクス

Server for Sardonyx・サードニクスのサーバー

## About・概要
Sardonyx is an online solution to transform how students and teachers use technology at the International Baccalaureate Diploma Program in Tokyo Metropolitan Kokusai High School. Sardonyx offers a cross-platfrom experience for all its users, through its mobile and web platforms. This repository contains code for Sardonyx's mobile application.

The mobile application offers a responsive mobile experience of Kokusai's online environment. It also provides a real time messaging service between students and teachers. This is a solution to enhance student-teacher communication while complying to the Tokyo Metropolitan Board of Education's policies. 

サードニクスは東京都立国際高校国際バカロレアコースの生徒と教員のテクノロジーの使い方を改新するためのオンラインソリューションです。
スマートフォンとウェブアプリケーションを通じてサードニクスはクロスプラットフォームなサービスを提供する予定です。このリポジトリでは、サードニクスのスマートフォンアプリケーションのコードを載せております。

本アプリケーションはスマートフォンでの国際高校のICT環境を改善するほか、生徒・教員間のリアルタイムメッセージングサービスを提供目標としています。これは東京都教育委員会のポリシーに従いながら、生徒と先生の間のコミュニケーションを改善するソリューションなのです。

## How to Use・使用方法
Sardonyx is currently under development and is not available for use.

サードニクスは現在開発途中で、まだ非公開です。

## API
Sardonyx's Managebac API can be accessed at the following endpoints.

### Authentication API
#### Validate login based on token
```
GET /api/validate
```
Required: `Login-Token` header with `login` and `password` for `https://kokusaiib.managebac.com`

#### Validate login based on multipart form 
```
POST /api/login
```
Required: multipart form in request body with `login` and `password` for `https://kokusaiib.managebac.com`

#### Reissue Managebac cookies based on token 
```
GET /api/login
```
Required: `Login-Token` header with `login` and `password` for `https://kokusaiib.managebac.com`

### Managebac API

#### Load dashboard 
```
GET /api/dashboard
```

Required: `Login-Token` header with JSON containing `cfduid` and `managebacSession` properties

#### Load class 
Load class overview 
```
GET /api/class/:classId/overview
```

Load class assignments 
```
GET /api/class/:classId/assignments
```

Load class messages 

Where `:pageParam` is the page number of the class messages list. If omitted, the app will retrieve page 1.
```
GET /api/class/:classId/messages
GET /api/class/:classId/messages?pageParam=:pageParam
```

Required: `Login-Token` header with JSON containing `cfduid` and `managebacSession` properties

#### Load group
Load group overview 
```
GET /api/group/:groupId/overview
```

Load group messages

Where `:pageParam` is the page number of the group messages list. If omitted, the app will retrieve page 1. 
```
GET /api/group/:groupId/messages
GET /api/group/:groupId/messages?pageParam=:pageParam
```

Required: `Login-Token` header with JSON containing `cfduid` and `managebacSession` properties

#### Load single assignment or event
Load single class assignment 
```
GET /api/class/:classId/assignments/:assignmentId
```

Load single event 
```
GET /api/event/:eventId
```

Load single class event 
```
GET /api/class/:classId/events/:eventId
```

Load single group event 
```
GET /api/group/:groupId/events/:eventId
```

Required: `Login-Token` header with JSON containing `cfduid` and `managebacSession` properties

#### Load single message
Load single class message 
```
GET /api/class/:classId/messages/:messageId
```

Load single group message 
```
GET /api/group/:groupId/messages/:messageId
```

Load comments to a comment message
```
GET /api/class/:classId/messages/:messageId/reply/:replyId
GET /api/group/:groupId/messages/:messageId/reply/:replyId
```

Note: `:replyId` is the id of the 2nd level comment being loaded, not the 1st level comment or the original message.

Note: requests loading comments to a comment message will not return new Authenticity Tokens in the header.

Required: `Login-Token` header with JSON containing `cfduid` and `managebacSession` properties

#### Send a message 
Send a class message
```
POST /api/class/:classId/messages
```

Send a group message 
```
POST /api/group/:groupId/messages
```

Required: `Login-Token` header with JSON containing `cfduid`, `managebacSession`, and `authenticityToken` properties

Required: `Message-Data` header with JSON:
```typescript
{
  topic: string, // title of the mesage, encoded as URI
  body: string, // body of the message in markdown, encoded as URI
  notifyViaEmail: number, // 0 for false, 1 for true
  privateMessage: number // 0 for false, 1 for true 
}
```

#### Edit a message 
Edit a class message
```
PATCH /api/class/:classId/messages/:messageId
```

Edit a group message 
```
PATCH /api/group/:groupId/messages/:messageId
```

Required: `Login-Token` header with JSON containing `cfduid`, `managebacSession`, and `authenticityToken` properties

Required: `Message-Data` header with JSON:
```typescript
{
  topic: string, // title of the mesage, encoded as URI
  body: string // body of the message in markdown, encoded as URI
}
```

#### Delete a message
Delete a class essage 
```
DELETE /api/class/:classId/messages/:messageId
```

Delete a group message
```
DELETE /api/class/:classId/messages/:messageId
```

Required: `Login-Token` header with JSON containing `cfduid`, `managebacSession`, and `authenticityToken` properties

#### Send a comment
Managebac allows users to comment on a comment, as long as the parent comment is a first level comment. 2nd level comments can be edited/updated like a 1st level comment. 
```
Message 
> Comment (1st level)
> > Comment (2nd level)
```

Send a comment (1st level) to a class message
```
POST /api/class/:classId/messages/:messageId/reply
```

Send a comment (1st level) to a group message
```
POST /api/group/:groupId/messages/:messageId/reply
```

If `:replyId` is specified, it will send a comment under the provided comment. Provided comment must be first level. 

Send a comment (2nd level) to a class message
```
POST /api/class/:classId/messages/:messageId/reply/:replyId
```

Send a comment (2nd level) to a group message
```
POST /api/group/:groupId/messages/:messageId/reply/:replyId
```

Required: `Login-Token` header with JSON containing `cfduid`, `managebacSession`, and `authenticityToken` properties

Required: `Message-Data` header with JSON:
```typescript
{
  body: string, // body of the message in markdown, encoded as URI
  notifyViaEmail: number, // 0 for false, 1 for true
  privateMessage: number // 0 for false, 1 for true 
}
```

#### Edit a comment
Edit a comment (of any level) under a class message
```
PATCH /api/class/:classId/messages/:messageId/reply/:replyId
```

Edit a comment (of any level) under a group message
```
PATCH /api/group/:groupId/messages/:messageId/reply/:replyId
```

Required: `Login-Token` header with JSON containing `cfduid`, `managebacSession`, and `authenticityToken` properties

Required: `Message-Data` header with JSON:
```typescript
{
  body: string // body of the message in markdown, encoded as URI
}
```

#### Delete a comment 
Delete a comment (of any level) under a class message
```
DELETE /api/class/:classId/messages/:messageId/reply/:replyId
```

Delete a comment (of any level) under a group message
```
DELETE /api/class/:classId/messages/:messageId/reply/:replyId
```
Required: `Login-Token` header with JSON containing `cfduid`, `managebacSession`, and `authenticityToken` properties


#### Load notifications 
Load notification list 

Where `:pageId` is the page number of the notification list. If omitted, the app will retrieve page 1.
```
GET /api/notification
GET /api/notification?pageId=:pageId
```

Load single notification 
```
GET /api/notification/:notificationId
```

Required: `Login-Token` header with JSON containing `cfduid` and `managebacSession` properties

#### Load CAS 
Load CAS worksheet 
```
GET /api/cas 
```

Load CAS experience overview
```
GET /api/cas/:casId/overview
```

Load CAS questions and answers 
```
GET /api/cas/:casId/answers
```

Load CAS reflections and evidences 
```
GET /api/cas/:casId/reflections
```

Required: `Login-Token` header with JSON containing `cfduid` and `managebacSession` properties

#### Update CAS Answers 
Update a CAS Answer 
```
POST /api/cas/:casId/answers 
```

Required: `Login-Token` header with JSON containing `cfduid`, `managebacSession`, and `authenticityToken` properties

Required: `Reflection-Data` header with JSON:
```typescript
{
  answers: [
    string, // Answer to the first question
    string, // Answer to the second question
    string // Ansewr to the third question 
  ]
}
```

#### Create/Edit/Delete CAS Reflections
Create a CAS reflection
```
POST /api/cas/:casId/reflections
```

Edit a CAS reflection
```
PATCH /api/cas/:casId/reflections/:reflectionId
```

Delete a CAS reflection
```
DELETE /api/cas/:casId/reflections/:reflectionId
```

Required: `Login-Token` header with JSON containing `cfduid`, `managebacSession`, and `authenticityToken` properties

Required: `Reflection-Data` header with JSON:
```typescript
{
  body: string, // body of the CAS reflection in markdown, encoded as URI
  educationalOutcomeIds: string // Omit for now, as this feature is not implemented yet
}
```

### Web-based Authentication API 
#### Student login 
```
POST /login/student 
```

Required: multipart form in request body with `login` and `password` for `https://kokusaiib.managebac.com`

#### Teacher login 
```
POST /login/teacher 
```

Required: multipart form in request body with Sardonyx `login` and `password` 

#### Logout 
```
GET /logout
```

Required: valid signed JWT cookie

#### Change Password (teachers)
```
POST /password
```

Required: valid signed JWT cookie with email and JSON request body in request body with `new_password`

### Tasklist API 
#### Load user details

```
GET /app/user
GET /app/user?tasklist=:tasklist
```

Required: valid signed JWT cookie with `email` property and `tasklist` property or a `tasklist` URL parameter

Tasklists can be specified for retrieving default labels (teachers only)

#### Change default labels 
Add default labels 
```
POST /app/user/subjects?id=:id
POST /app/user/categories?id=:id
```

Remove default labels 
```
DELETE /app/user/subjects?id=:id
DELETE /app/user/categories?id=:id
```

Required: valid signed JWT cookie with `id` property and `id` URL parameter (for label's id)

#### Change default tasklist 
```
PATCH /app/user/tasklist?id=:id
```

Required: valid signed JWT cookie with `id` property and `id` URL parameter (for tasklist's id)

#### Load tasklist 
```
GET /app/tasklist
GET /app/tasklist?tasklist=:tasklist
GET /app/tasklist?tasklist=all
```

Required for students: valid signed JWT cookie with `tasklist` property

Required for teachers: valid signed JWT cookie with `tasklist` property or a `tasklist` URL parameter 

To select all tasklists, pass `all` as the tasklist URL parameter (teachers only)

#### Load tasks 
```
GET /app/tasks
GET /app/tasks?tasklist=:tasklist
GET /app/tasks?full=true
```

Required for students: valid signed JWT cookie with `tasklist` property

Required for teachers: valid signed JWT token with `tasklist` property or a `tasklist` URL parameter 

To select labels associated with tasks, pass true for `full`.

#### Change tasks 
Create tasks 
```
POST /app/task
```

Required: valid signed JWT cookie and JSON request body with task information

Edit tasks 
```
PATCH /app/task?id=:id
```

Required: valid signed JWT cookie, `id` URL parameter, and JSON request body with task information. 

Delete tasks 
```
DELETE /app/task?id=:id
```

Required: valid signed JWT cookie and `id` URL parameter. 

#### Load subjects or categories labels 
```
GET /app/subjects
GET /app/subjects?tasklist=:tasklist
GET /app/categories
GET /app/categories?tasklist=:tasklist
```

Required for students: valid signed JWT cookie with `tasklist` property

Required for teachers: valid signed JWT with `tasklist` property or a `tasklist` URL parameter 

#### Change subjects or categories labels 
Add labels 
```
POST /app/subjects
POST /app/categories
```

Required: valid signed JWT cookie and JSON request body with label information.
 
Edit labels 
```
PATCH /app/subjects?id=:id
PATCH /app/categories?id=:id 
```

Required: valid signed JWT cookie, `id` URL paramter, JSON request body with label information 

Delete labels 
```
DELETE /app/subjects?id=:id
DELETE /app/categories?id=:id
```

Required: valid signed JWT cookie and `id` URL parameter

## Contribution
For contribution, see `CONTRIBUTING.md` in SardonyxApp/sardonyx repository.