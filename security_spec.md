# Security Specification & Threat Model

## Data Invariants
1. **User Profile Isolation**: A user can only read and write their own `/profiles/{userId}` document where `userId == request.auth.uid`. Admins can read student profiles for placement analytics.
2. **Readiness Score Ownership**: A user can only read and write their own `/scores/{userId}` document where `userId == request.auth.uid`. Admins can read aggregate metrics.
3. **Milestone Task Integrity**: A user can only query and write `/tasks/{taskId}` documents where `resource.data.userId == request.auth.uid` (or on create `request.resource.data.userId == request.auth.uid`). No student can modify another student's task completion state.
4. **Internship Application Privacy**: Student job search pipelines `/applications/{applicationId}` are strictly private to the student creator (`userId == request.auth.uid`).
5. **Notification Confidentiality**: Notifications `/notifications/{notificationId}` can only be queried or read by the recipient student (`userId == request.auth.uid`).
6. **Admin Isolation**: Admin documents `/admins/{adminUid}` cannot be created or modified by arbitrary users from the client SDK. Read is restricted to signed-in users verifying administrative rights.

## The Dirty Dozen (Malicious Payloads to Reject)
1. **Payload 1 (Profile Impersonation)**: Unauthenticated write to `/profiles/victim-uid`.
2. **Payload 2 (Profile Cross-User Write)**: Authenticated user `student-a` attempting to update `/profiles/student-b`.
3. **Payload 3 (Profile Privilege Escalation)**: Writing a ghost field `role: "admin"` to `/profiles/{uid}`.
4. **Payload 4 (Score Tampering)**: User attempting to modify another student's `/scores/student-b` total score.
5. **Payload 5 (Score Negative Point Exploit)**: Setting negative total scores or non-numeric types.
6. **Payload 6 (Task Spoofing)**: Submitting a task verification for `victim-uid` without ownership.
7. **Payload 7 (Task Ghost Field Injection)**: Adding extra unapproved attributes to `/tasks/{id}`.
8. **Payload 8 (Internship Snooping)**: Unrestricted collection query trying to list all other students' internship applications.
9. **Payload 9 (Notification Mark-Read Hijack)**: User updating `read: true` on another student's alert document.
10. **Payload 10 (Admin Self-Promotion)**: User attempting to write their own UID into `/admins/{request.auth.uid}`.
11. **Payload 11 (Oversized Payload / Wallet Exhaustion)**: Submitting 500KB string payload into a profile bio/skill field.
12. **Payload 12 (Invalid ID Path Injection)**: Submitting junk non-alphanumeric or path traversal string as document ID.

## Test Runner Verification
All 12 malicious payloads must receive `PERMISSION_DENIED` under zero-trust Firestore Security Rules.
