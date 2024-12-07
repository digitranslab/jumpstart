---
id: architecture
title: Architecture
---
# Introduction

JumpStart has two main components: **JumpStart Server** and **JumpStart Client**.

### 1. JumpStart Server  

JumpStart server is a Node.js API application. Server is responsible for authentication, authorization, persisting application definitions, running queries, storing data source credentials securely and more. 

**Dependencies:**
- **PostgreSQL** - JumpStart server persists data to a postgres database. 
- **Email service** (SMTP/Sendgrid/Mailgun/etc) - Required to send user invitations and password reset emails.   
    
### 2. JumpStart Client  

JumpStart client is a ReactJS application. Client is responsible for visually editing the applications, building & editing queries, rendering applications, executing events and their trigger, etc.

## Requirements

1. **Node version 14.x**
