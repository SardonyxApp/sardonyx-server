# sardonyx-server

Server for Sardonyx

## About

Sardonyx is an online solution to transform how high school students and teachers use technology to manage workloads. Sardonyx offers a cross-platfrom experience for all its users, through its mobile and web platforms. This repository contains code for Sardonyx's web application, targeted for computers and tablets.

The web application offers a group tasklist accessible by both teachers and students. Students and teachers benefit from the transparency of the workload, organized by due dates, subjects, and task categories. Each task on the list can be given a detailed description.

## How to Use

Navigate to [sardonyx.app](https://sardonyx.app), then enter your credentials. Students can use their Managebac credentials to login, while teachers are assigned a login and a password. 

Read the info page in the app to learn more about using the application.

## API

Sardonyx's Managebac API can be accessed at the following endpoints.

### Authentication API

Some endpoints will return the `defaults` array as formatted below.

```typescript
{
  deadlines: [
    {
      id: number,
      title: string,
      link: string, // Sardonyx API link
      labels: Array<string>, // Arrays of label names 
      deadline: boolean // true if it is a deadline
      due: string, // ISODateString
      author: string,
      avatar: string || null // URL to avatar
    },

    // ...
  ],
  classes: [
    {
      id: number,
      title: string,
      link: string 
    },

    // ...
  ],
  groups: [
    {
      id: number,
      title: string,
      link: string
    },

    // ...
  ],
  notificationCount: number,
  user: {
    id: number,
    name: string,
    avatar: string || null
  }
}

```

#### Validate login based on token

```
GET /api/validate
```

Required: `Login-Token` header with `login` and `password` for `https://kokusaiib.managebac.com`

Returns: `defaults` array containing upcoming deadlines in the dashboard page in the `Managebac-Data` header

#### Validate login based on multipart form 

```
POST /api/login
```

Required: multipart form in request body with `login` and `password` for `https://kokusaiib.managebac.com`

Returns: `defaults` array containing upcoming deadlines in the dashboard page in the `Managebac-Data` header

#### Reissue Managebac cookies based on token 

```
GET /api/login
```

Required: `Login-Token` header with `login` and `password` for `https://kokusaiib.managebac.com`

### Managebac API

Some endpoints will return the `deadlines` object as formatted below.

```typescript
{
  deadlines: [
    {
      id: number,
      title: string,
      link: string, // Sardonyx API link
      labels: Array<string>, // Arrays of label names 
      deadline: boolean // true if it is a deadline
      due: string, // ISODateString
      author: string,
      avatar: string || null // URL to avatar
    },

    // ...
  ]
}
```

Some endpoints will return the `messages` object as formatted below.

```typescript
{
  messages: [
    {
      id: number,
      title: string,
      link: string,
      content: string,
      onlyVisibleForTeachers: boolean,
      author: string,
      avatar: string || null, // URL to avatar
      date: string, // ISODateString
      files: Array<string>, // array of URLs
      comments: number // number of comments 
    },

    // ... 
  ],
  numberOfPages: number // if -2, there is only one page 
}
```

Some endpoints will return the `meesage` object as formatted below.

```typescript
  {
    message: [ // contains 1 item
      {
        id: number,
        title: string,
        link: string,
        content: string,
        onlyVisibleForTeachers: boolean,
        author: string,
        avatar: string || null, // URL to avatar
        date: string, // ISODateString
        files: Array<string>, // array of URLs
        comments: [
          {
            id: number,
            content: string, // html string 
            onlyVisibleForTeachers: boolean,
            author: string,
            avatar: string || null, // URL to avatar 
            comments: true, // if true, there are subcomments under the comment 
            files: Array<string> // Array of URLs
          },

          // ... 
        ]      
      }
    ]
  }
```

#### Load dashboard 

```
GET /api/dashboard
```

Required: `Login-Token` header with JSON containing `cfduid` and `managebacSession` properties

Returns: `deadlines` object containing upcoming deadlines in the dashboard page in the `Managebac-Data` header 

#### Load class 

Load class overview 

```
GET /api/class/:classId/overview
```

Returns: the `deadlines` object containing upcoming deadlines in the dashboard page in the `Managebac-Data` header

Load class assignments 

```
GET /api/class/:classId/assignments
```

Returns the `assignments` object in the `Managebac-Data` header

```typescript
{
  upcoming: [
    {
      id: number,
      title: string,
      link: string, // Sardonyx API link
      labels: Array<string>, // Arrays of label names 
      deadline: boolean // true if it is a deadline
      due: string, // ISODateString
      author: string,
      avatar: string || null // URL to avatar
    },

    // ...
  ],
  completed: [
    {
      id: number,
      title: string,
      link: string, // Sardonyx API link
      labels: Array<string>, // Arrays of label names 
      deadline: boolean // true if it is a deadline
      due: string, // ISODateString
      author: string,
      avatar: string || null // URL to avatar
    },
    
    // ... 
  ]
}
```

Load class messages 

Where `:pageParam` is the page number of the class messages list. If omitted, the app will retrieve page 1.

```
GET /api/class/:classId/messages
GET /api/class/:classId/messages?pageParam=:pageParam
```

Required: `Login-Token` header with JSON containing `cfduid` and `managebacSession` properties

Returns: `meesages` object and number of pages in the `Managebac-Data` header

#### Load group

Load group overview 
```
GET /api/group/:groupId/overview
```

Returns: `deadlines` object containing upcoming deadlines in the `Managebac-Data` header 

Load group messages

Where `:pageParam` is the page number of the group messages list. If omitted, the app will retrieve page 1. 

```
GET /api/group/:groupId/messages
GET /api/group/:groupId/messages?pageParam=:pageParam
```

Returns: `messages` array array containing upcoming deadlines in the `Managebac-Data` header 

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

Returns: `assignment` object in the `Managebac-Data` header

```typescript 
{
  assignment: {
    id: null,
    title: string,
    link: null, 
    labels: Array<string>, // Arrays of label names 
    deadline: boolean // true if it is a deadline
    due: string, // ISODateString
    details: string || null, // html string 
    attachments: [ // teacher uploaded files 
      {
        name: string,
        link: string
      },

      // ...
    ],
    dropbox: [ // student uploaded files 
      {
        title: string,
        link: string,
        date: string, // ISODateString
        similarity: number || null
      }

      // ...
    ],
    messages: [ // related messages
      {
        id: number,
        title: string,
        link: string,
        content: string, // html string 
        onlyVisibleForTeachers: boolean,
        author: string,
        avatar: string || null, // URL to avatar
        date: string, // ISODateString
        files: Array<string>, // array of URLs
        comments: number // number of comments
      }

      // ...
    ],
    author: string,
    avatar: string || null // URL to avatar 
  }
}
```

#### Load single message
Load single class message 

```
GET /api/class/:classId/messages/:messageId
```

Returns: `message` object in the `Managebac-Data` header

Load single group message 

```
GET /api/group/:groupId/messages/:messageId
```

Returns: `message` object in the `Managebac-Data` header

Load comments to a comment message

```
GET /api/class/:classId/messages/:messageId/reply/:replyId
GET /api/group/:groupId/messages/:messageId/reply/:replyId
```

Returns: `replyOfReply` object in the `Managebac-Data` headeer

```typescript
{
  replyOfReply: [
    {
      id: number,
      content: string, // html string 
      onlyVisibleForTeachers: boolean,
      author: string,
      avatar: string || avatar, // URL to avatar 
      date: string, // ISODateString
      files: Array<string> // Array of URLs
    },

    // ... 
  ]
}
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

Returns: `notifications` object and number of pages in the `Managebac-Data` header 

```typescript
{
  notifications: [
    {
      id: number,
      title: string,
      link: string, // Sardonyx URL 
      author: string,
      dateString: string, // Mmm DD, YYYY
      unread: boolean 
    },

    // ...
  ],
  numberOfPages: number 
}
```

Load single notification 
```
GET /api/notification/:notificationId
```

Returns: `notification` object in the `Managebac-Data` header 

```typescript
{
  notification: {
    title: string,
    author: string,
    date: Date,
    content: string // html string
  }
}
```

Required: `Login-Token` header with JSON containing `cfduid` and `managebacSession` properties

#### Load CAS 

Load CAS worksheet 

```
GET /api/cas 
```

Returns: `cas` object in the `Managebac-Data` header 

```typescript
{
  cas: [
    {
      id: number,
      title: string,
      description: string || null,
      types: Array<string>, // contains any of the following: creativity, activity, service 
      status: string || null, // either approved, complete, rejected, needs_approval, or null 
      labels: Array<string>,
      project: boolean,
      commentCount: number,
      reflectionCount: number
    },

    // ...
  ],
  documents: [
    {
      title: string,
      link: string,
      date: Date,
      similarity: number || null 
    },

    // ... 
  ]
}
```

Load CAS experience overview

```
GET /api/cas/:casId/overview
```

Returns extended `cas` object in the `Managebac-Data` header 

```typescript 
{
  cas: [
    {
      id: number,
      title: string,
      description: string || null,
      types: Array<string>, // Contains any of the following: creativity, activity, service 
      status: string || null, // Either approved, complete, rejected, needs_approval, or null 
      labels: Array<string>,
      project: boolean,
      commentCount: number,
      reflectionCount: null,
      description: string,
      learningOutcomes: string,
      timespan: string 
    }
  ]
}
```

Load CAS questions and answers 

```
GET /api/cas/:casId/answers
```

Returns: `answers` object in the `Managebac-Data` header 

```typescript
{
  answers: [ // 3 items 
    {
      question: string,
      answer: string // URL encoded 
    },
    
    // ...
  ]
}
```

Load CAS reflections and evidences 

```
GET /api/cas/:casId/reflections
```

Returns `reflections` object in the `Managebac-Data` header

```typescript
{
  reflections: [
    {
      id: number,
      date: string, // ISODateString
      labels: Array<string>, // Array of label anmes 
      type: string, // reflection, link, photo, other 
      content: string, // html string, type: reflection and type: other only 
      link: string, // type: link only 
      description: string, // type: link only 
      photos: [ // type: photos only 
        {
          title: string,
          link: string // URL to photo 
        },

        // ...
      ]
    },

    // ...
  ]
}
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

Note: Tasklists can be specified for retrieving default labels (teachers only)

Required: valid signed JWT cookie with `email` property and `tasklist` property or a `tasklist` URL parameter

Returns: `user` object

```typescript
  {
    id: number,
    name: string,
    year: number, // students only 
    tasklist_id: number, // teachers: default tasklist, students: permitted tasklist
    teacher: boolean,
    subjects: Array<number>, // default subjects
    categories: Array<number> // default categories
  }
```

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

Note: To select all tasklists, pass `all` as the tasklist URL parameter (teachers only)

Required for students: valid signed JWT cookie with `tasklist` property

Required for teachers: valid signed JWT cookie with `tasklist` property or a `tasklist` URL parameter 

Returns: `tasklist` object 

```typescript
{
  id: number,
  name: string,
  description: string || null 
}
```

#### Load tasks 
```
GET /app/tasks
GET /app/tasks?tasklist=:tasklist
GET /app/tasks?full=true
```

To select labels associated with tasks, pass true for `full`.

Required for students: valid signed JWT cookie with `tasklist` property

Required for teachers: valid signed JWT token with `tasklist` property or a `tasklist` URL parameter 

Retuurns: `tasks` object 

```typescript
[
  {
    id: number,
    name: string,
    description: string || null,
    due: string || null, // ISODateString 
    teasklist_id: number || null,
    student_id: number || null,
    teacher_id: number || null,
    subject_id: number || null,
    category_id: number || null,
    managebac: string // URL to related managebac page 
  },

  // ...
]
```

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

Returns: `subjects` or `categories` object 

```typescript
[
  {
    id: number,
    name: string,
    color: string, // length: 7
    tasklist_id: number,
    managebac: string // URL to related managebac class or group, subjects only 
  },

  // ...
]
```

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