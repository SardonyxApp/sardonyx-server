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

#### Load single assignment 
Load single class assignment 
```
GET /api/class/:classId/assignments/:assignmentId
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

Required: `Login-Token` header with JSON containing `cfduid` and `managebacSession` properties

#### Send a message 
```
POST /api/class/:classId/messages
POST /api/group/:groupId/messages
```

Required: `Login-Token` header with JSON containing `cfduid`, `managebacSession`, and `csrfToken` properties

Required: `Message-Data` header with JSON:
```typescript
{
  topic: string, // title of the mesage, encoded as URI
  body: string, // body of the message, encoded as URI
  notifyViaEmail: number, // 0 for false, 1 for true
  privateMessage: number // 0 for false, 1 for true 
}
```

#### Edit a message 
```
PATCH /api/class/:classId/messages/:messageId
PATCH /api/group/:groupId/messages/:messageId
```

Required: `Login-Token` header with JSON containing `cfduid`, `managebacSession`, and `csrfToken` properties

Required: `Message-Data` header with JSON:
```typescript
{
  topic: string, // title of the mesage, encoded as URI
  body: string // body of the message, encoded as URI
}
```

#### Delete a message 
```
DELETE /api/class/:classId/messages/:messageId
DELETE /api/class/:classId/messages/:messageId
```
Required: `Login-Token` header with JSON containing `cfduid`, `managebacSession`, and `csrfToken` properties

#### Send a comment
Managebac allows users to comment on a comment, as long as the parent comment is a first level comment. 2nd level comments can be edited/updated like a 1st level comment. 
```
Message 
> Comment (1st level)
> > Comment (2nd level)
```

Send a comment (1st level)
```
POST /api/class/:classId/messages/:messageId/reply
POST /api/group/:groupId/messages/:messageId/reply
```

Send a comment (2nd level)

If `:replyId` is specified, it will send a comment under the provided comment. Provided comment must be first level. 
```
POST /api/class/:classId/messages/:messageId/reply/:replyId
POST /api/group/:groupId/messages/:messageId/reply/:replyId
```

Required: `Login-Token` header with JSON containing `cfduid`, `managebacSession`, and `csrfToken` properties

Required: `Message-Data` header with JSON:
```typescript
{
  body: string, // body of the message, encoded as URI
  notifyViaEmail: number, // 0 for false, 1 for true
  privateMessage: number // 0 for false, 1 for true 
}
```

#### Edit a comment
Edit a comment (of any level) 
```
PATCH /api/class/:classId/messages/:messageId/reply/:replyId
PATCH /api/group/:groupId/messages/:messageId/reply/:replyId
```

Required: `Login-Token` header with JSON containing `cfduid`, `managebacSession`, and `csrfToken` properties

Required: `Message-Data` header with JSON:
```typescript
{
  body: string // body of the message, encoded as URI
}
```

#### Delete a comment 
Delete a comment (of any level)
```
DELETE /api/class/:classId/messages/:messageId/reply/:replyId
DELETE /api/class/:classId/messages/:messageId/reply/:replyId
```
Required: `Login-Token` header with JSON containing `cfduid`, `managebacSession`, and `csrfToken` properties


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
Load CAS worksheet overview 
```
GET /api/cas 
```

Load CAS experience 
```
GET /api/cas/:casId
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

## Contribution
For contribution, see `CONTRIBUTING.md` in SardonyxApp/sardonyx repository.