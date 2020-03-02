# sardonyx-server

Server for Sardonyx

## About

Sardonyx is an online solution to transform how high school students and teachers use technology to manage workloads. Sardonyx offers a cross-platfrom experience for all its users, through its mobile and web platforms. This repository contains code for Sardonyx's web application, targeted for computers and tablets.

The web application offers a group tasklist accessible by both teachers and students. Students and teachers benefit from the transparency of the workload, organized by due dates, subjects, and task categories. Each task on the list can be given a detailed description.

## Note
The Managebac integration is deprecated.

## How to Use

Navigate to [sardonyx.app](https://sardonyx.app), then enter your credentials. 

## API

Sardonyx's Managebac API can be accessed at the following endpoints.


### Web-based Authentication API 

#### Login 

```
POST /login 
```

Required: multipart form in request body with Sardonyx `login` and `password` 

#### Logout 

```
GET /logout
```

Required: valid signed JWT cookie

#### Change Password

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

Note: Tasklists can be specified for retrieving default labels

Required: valid signed JWT cookie with `email` property and `tasklist` property or a `tasklist` URL parameter

Returns: `user` object

```typescript
  {
    id: number,
    name: string,
    tasklist_id: number, // default tasklist
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

Note: To select all tasklists, pass `all` as the tasklist URL parameter 

Required: valid signed JWT cookie with `tasklist` property or a `tasklist` URL parameter 

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

Required: valid signed JWT token with `tasklist` property or a `tasklist` URL parameter 

Retuurns: `tasks` object 

```typescript
[
  {
    id: number,
    name: string,
    description: string || null,
    due: string || null, // ISODateString 
    teasklist_id: number || null,
    user_id: number || null,
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

Required: valid signed JWT with `tasklist` property or a `tasklist` URL parameter 

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