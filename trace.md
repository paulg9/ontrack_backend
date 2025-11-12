==> Deploying...
Task start deno run --allow-net --allow-write --allow-read --allow-sys --allow-env src/main.ts
Download https://registry.npmjs.org/mongodb
Requesting concept initialized with a timeout of 10000ms.
Registering concept passthrough routes.
  -> /api/LikertSurvey/submitResponse
  -> /api/LikertSurvey/updateResponse
  -> /api/LikertSurvey/_getSurveyQuestions
  -> /api/LikertSurvey/_getSurveyResponses
  -> /api/LikertSurvey/_getRespondentAnswers
  -> /api/UserAccount/register
  -> /api/UserAccount/login
  -> /api/UserAccount/_resolveShareLink
🚀 Requesting server listening for POST requests at base path of /api/*
Listening on http://0.0.0.0:10000/ (http://localhost:10000/)
==> Your service is live 🎉
==> 
==> ///////////////////////////////////////////////////////////
==> 
==> Available at your primary URL https://ontrack-backend-pi6y.onrender.com
==> 
==> ///////////////////////////////////////////////////////////
[Requesting] Received request for path: /UserAccount/_isSignedIn
Requesting.request {
  session: '3224086f-8e35-46e7-8e3b-a22f93e01b5a',
  path: '/UserAccount/_isSignedIn'
} => { request: '019a769a-e05e-7ad2-aff3-4d0fccac26c4' }
Requesting.respond {
  request: '019a769a-e05e-7ad2-aff3-4d0fccac26c4',
  results: [ { signedIn: true } ]
} => { request: '019a769a-e05e-7ad2-aff3-4d0fccac26c4' }
[Requesting] Received request for path: /UserAccount/_getUserByToken
Requesting.request {
  session: '3224086f-8e35-46e7-8e3b-a22f93e01b5a',
  path: '/UserAccount/_getUserByToken'
} => { request: '019a769a-e205-7196-ad7c-8f09d3490426' }
Requesting.respond {
  request: '019a769a-e205-7196-ad7c-8f09d3490426',
  results: [ { user: '019a3cf2-6fba-704f-9a16-6c7e36897904' } ]
} => { request: '019a769a-e205-7196-ad7c-8f09d3490426' }
[Requesting] Received request for path: /UserAccount/_isAdmin
Requesting.request {
  session: '3224086f-8e35-46e7-8e3b-a22f93e01b5a',
  path: '/UserAccount/_isAdmin'
} => { request: '019a769a-e3a7-7374-8028-b6926faffe9c' }
Requesting.respond {
  request: '019a769a-e3a7-7374-8028-b6926faffe9c',
  results: [ { isAdmin: true } ]
} => { request: '019a769a-e3a7-7374-8028-b6926faffe9c' }
[Requesting] Received request for path: /RehabPlan/_getActivePlanByOwner
[Requesting] Received request for path: /CheckIn/_getCheckInByOwnerAndDate
[Requesting] Received request for path: /ExerciseLibrary/_listExercises
Requesting.request {
  session: '3224086f-8e35-46e7-8e3b-a22f93e01b5a',
  path: '/RehabPlan/_getActivePlanByOwner'
} => { request: '019a769a-e5cf-7542-ac46-eb08b9eafb30' }
Requesting.respond {
  request: '019a769a-e5cf-7542-ac46-eb08b9eafb30',
  results: [
    {
      _id: '019a3cf2-7185-7b31-8c15-d2defac7438a',
      owner: '019a3cf2-6fba-704f-9a16-6c7e36897904',
      archived: false,
      items: []
    }
  ]
} => { request: '019a769a-e5cf-7542-ac46-eb08b9eafb30' }
Requesting.request {
  session: '3224086f-8e35-46e7-8e3b-a22f93e01b5a',
  date: '2025-11-12',
  path: '/CheckIn/_getCheckInByOwnerAndDate'
} => { request: '019a769a-e5d4-766d-bc8b-5775de71a32d' }
Requesting.request {
  session: '3224086f-8e35-46e7-8e3b-a22f93e01b5a',
  includeDeprecated: false,
  path: '/ExerciseLibrary/_listExercises'
} => { request: '019a769a-e5d8-7350-ba25-342fec571d87' }
[Requesting] Error processing request: Binding: Symbol(owner) not found in frame: [object Object]
Requesting.respond {
  request: '019a769a-e5d8-7350-ba25-342fec571d87',
  results: [
    {
      _id: '019a3d23-5023-7ac3-989c-7cc0408dd939',
      title: 'Bulgarian Split Squats',
      cues: '',
      recommendedFreq: 0,
      deprecated: false
    },
    {
      _id: '019a3d2c-44a2-7ed2-85d4-f7dd004216b8',
      title: 'Pull up',
      cues: 'Grip the bar overhand, slightly wider than your shoulders, with arms fully extended. Retract your shoulder blades, brace your core, and pull your chest towards the bar until your chin clears it. Lower yourself with control to the starting position.',
      recommendedFreq: 3,
      deprecated: false,
      videoUrl: 'https://www.youtube.com/watch?v=eGo4IYlbE5g'
    },
    {
      _id: '019a3d2f-632a-7564-8171-9cc9ea41ec27',
      title: 'Push up',
      cues: 'Start in a strong plank position with hands slightly wider than shoulder-width, fingers pointing forward. Keep your body in a straight line from head to heels, engaging your core and glutes. Lower your chest towards the floor by bending your elbows, then push back up powerfully.',
      recommendedFreq: 3,
      deprecated: false
    },
    {
      _id: '019a3d31-1600-77b4-bbed-00fc3b0500c2',
      title: 'Calf raise',
      cues: 'Stand tall with feet hip-width apart. Slowly lift your heels as high as possible, pushing through the balls of your feet and squeezing your calves at the top. Control the descent back down, feeling a stretch in your calves.',
      recommendedFreq: 3,
      deprecated: false
    },
    {
      _id: '019a3d66-b6a0-770b-aecc-1d72c9bebdb5',
      title: 'Box Jump',
      cues: 'Stand facing a stable box, feet hip-width apart. Load by hinging at your hips and bending your knees, then explode upwards, driving through your heels and swinging your arms to land softly on the entire foot on the box. Step down carefully one foot at a time.',
      deprecated: false
    },
    {
      _id: '019a3d81-e3b2-7c9a-8240-27c9bac31510',
      title: 'Kettlebell lunges',
      cues: 'Hold the kettlebell in a goblet position close to your chest. Step back with one leg, lowering your hips until both knees are bent at 90 degrees. Keep your front knee aligned over your ankle and push through your front heel to return to standing.',
      deprecated: false
    },
    {
      _id: '019a7665-e422-7a3b-932d-613e197c54a8',
      title: 'Hip thrust',
      cues: 'Set your upper back against a bench, feet flat and hip-width apart. Drive through your heels to lift your hips, squeezing your glutes hard at the top until your body forms a straight line from shoulders to knees. Control the movement down, keeping your core tight and avoiding lower back arch.',
      deprecated: false,
      videoUrl: 'https://www.youtube.com/watch?v=LM8DGvWQJ3Q'
    },
    {
      _id: '019a766a-391b-7501-a9fe-4f695247dc75',
      title: '10 yard sprints',
      cues: 'Start in an athletic stance with a slight forward lean, ready to explode. Drive your knees high and pump your arms powerfully to maximize acceleration and speed over the 10 yards.',
      deprecated: false
    },
    {
      _id: '019a7676-10fd-7562-bc0e-b0e7c6bea6d9',
      title: 'incline barbell bench press',
      cues: 'Lie on an incline bench with your feet flat on the floor, gripping the bar slightly wider than shoulder-width. Lower the bar slowly to your upper chest, keeping your elbows slightly tucked. Press the bar back up powerfully, extending your arms without locking your elbows, maintaining a stable back and retracted shoulder blades.',
      deprecated: false
    },
    {
      _id: '019a7679-e82e-7836-8d39-358c2d19b393',
      title: 'nordic hamstring curl',
      cues: 'Kneel with ankles secured, keeping your body in a straight line from head to knees. Slowly lower your torso forward, resisting the fall primarily with your hamstrings. Control the descent as long as possible, then use your hands to push back up if needed.',
      deprecated: false
    }
  ]
} => { request: '019a769a-e5d8-7350-ba25-342fec571d87' }
UserAccount.login { username: 'admin', password: 'admin123' } => { token: 'a04431aa-2898-4be4-8137-d5d133225b84' }
[Requesting] Received request for path: /UserAccount/_getUserByToken
Requesting.request {
  session: 'a04431aa-2898-4be4-8137-d5d133225b84',
  path: '/UserAccount/_getUserByToken'
} => { request: '019a769a-fb98-71d7-8dab-6f0feeaa906f' }
Requesting.respond {
  request: '019a769a-fb98-71d7-8dab-6f0feeaa906f',
  results: [ { user: '019a3cf2-6fba-704f-9a16-6c7e36897904' } ]
} => { request: '019a769a-fb98-71d7-8dab-6f0feeaa906f' }
[Requesting] Received request for path: /UserAccount/_isAdmin
Requesting.request {
  session: 'a04431aa-2898-4be4-8137-d5d133225b84',
  path: '/UserAccount/_isAdmin'
} => { request: '019a769a-fd40-702e-9e6c-28c2a6242168' }
Requesting.respond {
  request: '019a769a-fd40-702e-9e6c-28c2a6242168',
  results: [ { isAdmin: true } ]
} => { request: '019a769a-fd40-702e-9e6c-28c2a6242168' }
[Requesting] Received request for path: /UserAccount/logout
Requesting.request {
  session: 'a04431aa-2898-4be4-8137-d5d133225b84',
  path: '/UserAccount/logout'
} => { request: '019a769b-0e86-7b15-bf3e-20ec15c65462' }
UserAccount.logout { token: 'a04431aa-2898-4be4-8137-d5d133225b84' } => {}
Requesting.respond { request: '019a769b-0e86-7b15-bf3e-20ec15c65462' } => { request: '019a769b-0e86-7b15-bf3e-20ec15c65462' }
Requesting.respond {
  request: '019a769b-0e86-7b15-bf3e-20ec15c65462',
  error: 'unauthenticated'
} => { request: '019a769b-0e86-7b15-bf3e-20ec15c65462' }
UserAccount.login { username: 'admin', password: 'admin123' } => { token: '8e744f9e-c592-4869-86e3-f23287023009' }
[Requesting] Received request for path: /UserAccount/_getUserByToken
Requesting.request {
  session: '8e744f9e-c592-4869-86e3-f23287023009',
  path: '/UserAccount/_getUserByToken'
} => { request: '019a769b-a718-73b1-a851-482449117077' }
Requesting.respond {
  request: '019a769b-a718-73b1-a851-482449117077',
  results: [ { user: '019a3cf2-6fba-704f-9a16-6c7e36897904' } ]
} => { request: '019a769b-a718-73b1-a851-482449117077' }
[Requesting] Received request for path: /UserAccount/_isAdmin
Requesting.request {
  session: '8e744f9e-c592-4869-86e3-f23287023009',
  path: '/UserAccount/_isAdmin'
} => { request: '019a769b-a8bb-73db-bb03-b8862c8784ee' }
Requesting.respond {
  request: '019a769b-a8bb-73db-bb03-b8862c8784ee',
  results: [ { isAdmin: true } ]
} => { request: '019a769b-a8bb-73db-bb03-b8862c8784ee' }
[Requesting] Received request for path: /ExerciseLibrary/_listExercises
Requesting.request {
  session: '8e744f9e-c592-4869-86e3-f23287023009',
  includeDeprecated: false,
  path: '/ExerciseLibrary/_listExercises'
} => { request: '019a769b-aae8-7ac8-a1b7-69637f05eeb8' }
[Requesting] Received request for path: /RehabPlan/_getActivePlanByOwner
[Requesting] Received request for path: /CheckIn/_getCheckInByOwnerAndDate
Requesting.respond {
  request: '019a769b-aae8-7ac8-a1b7-69637f05eeb8',
  results: [
    {
      _id: '019a3d23-5023-7ac3-989c-7cc0408dd939',
      title: 'Bulgarian Split Squats',
      cues: '',
      recommendedFreq: 0,
      deprecated: false
    },
    {
      _id: '019a3d2c-44a2-7ed2-85d4-f7dd004216b8',
      title: 'Pull up',
      cues: 'Grip the bar overhand, slightly wider than your shoulders, with arms fully extended. Retract your shoulder blades, brace your core, and pull your chest towards the bar until your chin clears it. Lower yourself with control to the starting position.',
      recommendedFreq: 3,
      deprecated: false,
      videoUrl: 'https://www.youtube.com/watch?v=eGo4IYlbE5g'
    },
    {
      _id: '019a3d2f-632a-7564-8171-9cc9ea41ec27',
      title: 'Push up',
      cues: 'Start in a strong plank position with hands slightly wider than shoulder-width, fingers pointing forward. Keep your body in a straight line from head to heels, engaging your core and glutes. Lower your chest towards the floor by bending your elbows, then push back up powerfully.',
      recommendedFreq: 3,
      deprecated: false
    },
    {
      _id: '019a3d31-1600-77b4-bbed-00fc3b0500c2',
      title: 'Calf raise',
      cues: 'Stand tall with feet hip-width apart. Slowly lift your heels as high as possible, pushing through the balls of your feet and squeezing your calves at the top. Control the descent back down, feeling a stretch in your calves.',
      recommendedFreq: 3,
      deprecated: false
    },
    {
      _id: '019a3d66-b6a0-770b-aecc-1d72c9bebdb5',
      title: 'Box Jump',
      cues: 'Stand facing a stable box, feet hip-width apart. Load by hinging at your hips and bending your knees, then explode upwards, driving through your heels and swinging your arms to land softly on the entire foot on the box. Step down carefully one foot at a time.',
      deprecated: false
    },
    {
      _id: '019a3d81-e3b2-7c9a-8240-27c9bac31510',
      title: 'Kettlebell lunges',
      cues: 'Hold the kettlebell in a goblet position close to your chest. Step back with one leg, lowering your hips until both knees are bent at 90 degrees. Keep your front knee aligned over your ankle and push through your front heel to return to standing.',
      deprecated: false
    },
    {
      _id: '019a7665-e422-7a3b-932d-613e197c54a8',
      title: 'Hip thrust',
      cues: 'Set your upper back against a bench, feet flat and hip-width apart. Drive through your heels to lift your hips, squeezing your glutes hard at the top until your body forms a straight line from shoulders to knees. Control the movement down, keeping your core tight and avoiding lower back arch.',
      deprecated: false,
      videoUrl: 'https://www.youtube.com/watch?v=LM8DGvWQJ3Q'
    },
    {
      _id: '019a766a-391b-7501-a9fe-4f695247dc75',
      title: '10 yard sprints',
      cues: 'Start in an athletic stance with a slight forward lean, ready to explode. Drive your knees high and pump your arms powerfully to maximize acceleration and speed over the 10 yards.',
      deprecated: false
    },
    {
      _id: '019a7676-10fd-7562-bc0e-b0e7c6bea6d9',
      title: 'incline barbell bench press',
      cues: 'Lie on an incline bench with your feet flat on the floor, gripping the bar slightly wider than shoulder-width. Lower the bar slowly to your upper chest, keeping your elbows slightly tucked. Press the bar back up powerfully, extending your arms without locking your elbows, maintaining a stable back and retracted shoulder blades.',
      deprecated: false
    },
    {
      _id: '019a7679-e82e-7836-8d39-358c2d19b393',
      title: 'nordic hamstring curl',
      cues: 'Kneel with ankles secured, keeping your body in a straight line from head to knees. Slowly lower your torso forward, resisting the fall primarily with your hamstrings. Control the descent as long as possible, then use your hands to push back up if needed.',
      deprecated: false
    }
  ]
} => { request: '019a769b-aae8-7ac8-a1b7-69637f05eeb8' }
Requesting.request {
  session: '8e744f9e-c592-4869-86e3-f23287023009',
  path: '/RehabPlan/_getActivePlanByOwner'
} => { request: '019a769b-abc9-77d0-b32f-3675c97deeaa' }
Requesting.request {
  session: '8e744f9e-c592-4869-86e3-f23287023009',
  date: '2025-11-12',
  path: '/CheckIn/_getCheckInByOwnerAndDate'
} => { request: '019a769b-abd1-74ed-87e0-9cc01b593199' }
[Requesting] Error processing request: Binding: Symbol(owner) not found in frame: [object Object]
Requesting.respond {
  request: '019a769b-abc9-77d0-b32f-3675c97deeaa',
  results: [
    {
      _id: '019a3cf2-7185-7b31-8c15-d2defac7438a',
      owner: '019a3cf2-6fba-704f-9a16-6c7e36897904',
      archived: false,
      items: []
    }
  ]
} => { request: '019a769b-abc9-77d0-b32f-3675c97deeaa' }
[Requesting] Received request for path: /ExerciseLibrary/_listExercises
Requesting.request {
  session: '8e744f9e-c592-4869-86e3-f23287023009',
  includeDeprecated: true,
  path: '/ExerciseLibrary/_listExercises'
} => { request: '019a769b-b5d1-7ff7-8e1b-00130fd5f462' }
Requesting.respond {
  request: '019a769b-b5d1-7ff7-8e1b-00130fd5f462',
  results: [
    {
      _id: '019a3cfc-857e-764b-b1fa-8a3510cbdfd3',
      title: 'Squat',
      videoUrl: null,
      cues: 'squat',
      recommendedFreq: 3,
      deprecated: true
    },
    {
      _id: '019a3d0c-2985-7337-a71f-5fb98e0f7587',
      title: 'Barbell Bench Press',
      cues: '',
      recommendedFreq: 0,
      deprecated: true
    },
    {
      _id: '019a3d23-5023-7ac3-989c-7cc0408dd939',
      title: 'Bulgarian Split Squats',
      cues: '',
      recommendedFreq: 0,
      deprecated: false
    },
    {
      _id: '019a3d2c-0636-7aa8-a702-afe4fa58ad02',
      title: 'Single Leg hip bridge',
      cues: '',
      recommendedFreq: 0,
      deprecated: true
    },
    {
      _id: '019a3d2c-44a2-7ed2-85d4-f7dd004216b8',
      title: 'Pull up',
      cues: 'Grip the bar overhand, slightly wider than your shoulders, with arms fully extended. Retract your shoulder blades, brace your core, and pull your chest towards the bar until your chin clears it. Lower yourself with control to the starting position.',
      recommendedFreq: 3,
      deprecated: false,
      videoUrl: 'https://www.youtube.com/watch?v=eGo4IYlbE5g'
    },
    {
      _id: '019a3d2f-632a-7564-8171-9cc9ea41ec27',
      title: 'Push up',
      cues: 'Start in a strong plank position with hands slightly wider than shoulder-width, fingers pointing forward. Keep your body in a straight line from head to heels, engaging your core and glutes. Lower your chest towards the floor by bending your elbows, then push back up powerfully.',
      recommendedFreq: 3,
      deprecated: false
    },
    {
      _id: '019a3d31-1600-77b4-bbed-00fc3b0500c2',
      title: 'Calf raise',
      cues: 'Stand tall with feet hip-width apart. Slowly lift your heels as high as possible, pushing through the balls of your feet and squeezing your calves at the top. Control the descent back down, feeling a stretch in your calves.',
      recommendedFreq: 3,
      deprecated: false
    },
    {
      _id: '019a3d66-b6a0-770b-aecc-1d72c9bebdb5',
      title: 'Box Jump',
      cues: 'Stand facing a stable box, feet hip-width apart. Load by hinging at your hips and bending your knees, then explode upwards, driving through your heels and swinging your arms to land softly on the entire foot on the box. Step down carefully one foot at a time.',
      deprecated: false
    },
    {
      _id: '019a3d81-e3b2-7c9a-8240-27c9bac31510',
      title: 'Kettlebell lunges',
      cues: 'Hold the kettlebell in a goblet position close to your chest. Step back with one leg, lowering your hips until both knees are bent at 90 degrees. Keep your front knee aligned over your ankle and push through your front heel to return to standing.',
      deprecated: false
    },
    {
      _id: '019a7665-e422-7a3b-932d-613e197c54a8',
      title: 'Hip thrust',
      cues: 'Set your upper back against a bench, feet flat and hip-width apart. Drive through your heels to lift your hips, squeezing your glutes hard at the top until your body forms a straight line from shoulders to knees. Control the movement down, keeping your core tight and avoiding lower back arch.',
      deprecated: false,
      videoUrl: 'https://www.youtube.com/watch?v=LM8DGvWQJ3Q'
    },
    {
      _id: '019a766a-391b-7501-a9fe-4f695247dc75',
      title: '10 yard sprints',
      cues: 'Start in an athletic stance with a slight forward lean, ready to explode. Drive your knees high and pump your arms powerfully to maximize acceleration and speed over the 10 yards.',
      deprecated: false
    },
    {
      _id: '019a7676-10fd-7562-bc0e-b0e7c6bea6d9',
      title: 'incline barbell bench press',
      cues: 'Lie on an incline bench with your feet flat on the floor, gripping the bar slightly wider than shoulder-width. Lower the bar slowly to your upper chest, keeping your elbows slightly tucked. Press the bar back up powerfully, extending your arms without locking your elbows, maintaining a stable back and retracted shoulder blades.',
      deprecated: false
    },
    {
      _id: '019a7679-e82e-7836-8d39-358c2d19b393',
      title: 'nordic hamstring curl',
      cues: 'Kneel with ankles secured, keeping your body in a straight line from head to knees. Slowly lower your torso forward, resisting the fall primarily with your hamstrings. Control the descent as long as possible, then use your hands to push back up if needed.',
      deprecated: false
    }
  ]
} => { request: '019a769b-b5d1-7ff7-8e1b-00130fd5f462' }
[Requesting] Received request for path: /ExerciseLibrary/_listProposals
Requesting.request {
  session: '8e744f9e-c592-4869-86e3-f23287023009',
  path: '/ExerciseLibrary/_listProposals'
} => { request: '019a769b-b809-70b4-bfd1-9b25f9c747f4' }
Requesting.respond {
  request: '019a769b-b809-70b4-bfd1-9b25f9c747f4',
  results: [
    {
      _id: '019a3d2c-6926-7924-919e-bfaf0e729184',
      exercise: '019a3d2c-44a2-7ed2-85d4-f7dd004216b8',
      createdAt: '2025-11-01T02:08:32.038Z',
      videoUrl: 'https://www.youtube.com/watch?v=eGo4IYlbE5g',
      cues: 'Grip the bar overhand, slightly wider than your shoulders, with arms fully extended. Retract your shoulder blades, brace your core, and pull your chest towards the bar until your chin clears it. Lower yourself with control to the starting position.',
      recommendedFreq: 3,
      confidence_0_1: 0.95,
      status: 'applied'
    },
    {
      _id: '019a3d2f-6e9f-766b-85c8-ff72957fa8de',
      exercise: '019a3d2f-632a-7564-8171-9cc9ea41ec27',
      createdAt: '2025-11-01T02:11:50.047Z',
      videoUrl: null,
      cues: 'Start in a strong plank position with hands slightly wider than shoulder-width, fingers pointing forward. Keep your body in a straight line from head to heels, engaging your core and glutes. Lower your chest towards the floor by bending your elbows, then push back up powerfully.',
      recommendedFreq: 3,
      confidence_0_1: 0.95,
      status: 'discarded'
    },
    {
      _id: '019a3d31-22f6-7b87-af6d-0d103fd99949',
      exercise: '019a3d31-1600-77b4-bbed-00fc3b0500c2',
      createdAt: '2025-11-01T02:13:41.750Z',
      videoUrl: null,
      cues: 'Stand tall with feet hip-width apart. Slowly lift your heels as high as possible, pushing through the balls of your feet and squeezing your calves at the top. Control the descent back down, feeling a stretch in your calves.',
      recommendedFreq: 3,
      confidence_0_1: 0.9,
      status: 'applied'
    },
    {
      _id: '019a3d66-c4c5-7e06-87dd-5f5dc8345b1d',
      exercise: '019a3d66-b6a0-770b-aecc-1d72c9bebdb5',
      createdAt: '2025-11-01T03:12:16.581Z',
      videoUrl: null,
      cues: 'Stand facing a stable box, feet hip-width apart. Load by hinging at your hips and bending your knees, then explode upwards, driving through your heels and swinging your arms to land softly on the entire foot on the box. Step down carefully one foot at a time.',
      confidence_0_1: 0.9,
      status: 'applied'
    },
    {
      _id: '019a3d81-f075-718d-b656-81eb46151ff7',
      exercise: '019a3d81-e3b2-7c9a-8240-27c9bac31510',
      createdAt: '2025-11-01T03:41:57.237Z',
      videoUrl: null,
      cues: 'Hold the kettlebell in a goblet position close to your chest. Step back with one leg, lowering your hips until both knees are bent at 90 degrees. Keep your front knee aligned over your ankle and push through your front heel to return to standing.',
      confidence_0_1: 0.9,
      status: 'applied'
    },
    {
      _id: '019a7665-f719-7ee1-a93a-75f12ffc7536',
      exercise: '019a7665-e422-7a3b-932d-613e197c54a8',
      createdAt: '2025-11-12T04:49:45.241Z',
      videoUrl: 'https://www.youtube.com/watch?v=LM8DGvWQJ3Q',
      cues: 'Set your upper back against a bench, feet flat and hip-width apart. Drive through your heels to lift your hips, squeezing your glutes hard at the top until your body forms a straight line from shoulders to knees. Control the movement down, keeping your core tight and avoiding lower back arch.',
      confidence_0_1: 0.98,
      status: 'applied'
    },
    {
      _id: '019a766a-44d8-703e-b1b1-824c23771fb4',
      exercise: '019a766a-391b-7501-a9fe-4f695247dc75',
      createdAt: '2025-11-12T04:54:27.289Z',
      videoUrl: null,
      cues: 'Start in an athletic stance with a slight forward lean, ready to explode. Drive your knees high and pump your arms powerfully to maximize acceleration and speed over the 10 yards.',
      confidence_0_1: 0.9,
      status: 'applied'
    },
    {
      _id: '019a7676-1d02-7f79-9fbd-9936b9ceb8ad',
      exercise: '019a7676-10fd-7562-bc0e-b0e7c6bea6d9',
      createdAt: '2025-11-12T05:07:23.522Z',
      videoUrl: null,
      cues: 'Lie on an incline bench with your feet flat on the floor, gripping the bar slightly wider than shoulder-width. Lower the bar slowly to your upper chest, keeping your elbows slightly tucked. Press the bar back up powerfully, extending your arms without locking your elbows, maintaining a stable back and retracted shoulder blades.',
      confidence_0_1: 1,
      status: 'applied'
    },
    {
      _id: '019a7679-f73e-7f4c-8ac2-52d82feb4477',
      exercise: '019a7679-e82e-7836-8d39-358c2d19b393',
      createdAt: '2025-11-12T05:11:35.998Z',
      videoUrl: null,
      cues: 'Kneel with ankles secured, keeping your body in a straight line from head to knees. Slowly lower your torso forward, resisting the fall primarily with your hamstrings. Control the descent as long as possible, then use your hands to push back up if needed.',
      confidence_0_1: 0.95,
      status: 'applied'
    }
  ]
} => { request: '019a769b-b809-70b4-bfd1-9b25f9c747f4' }
[Requesting] Received request for path: /ExerciseLibrary/addExerciseDraft
Requesting.request {
  session: '8e744f9e-c592-4869-86e3-f23287023009',
  title: 'barbell rows',
  path: '/ExerciseLibrary/addExerciseDraft'
} => { request: '019a769b-ec31-75f8-a51e-895fb75d965b' }
ExerciseLibrary.addExerciseDraft { title: 'barbell rows', actorIsAdmin: true } => { exercise: '019a769b-ecfa-7fec-9467-757631bdddcf' }
Requesting.respond {
  request: '019a769b-ec31-75f8-a51e-895fb75d965b',
  exercise: '019a769b-ecfa-7fec-9467-757631bdddcf'
} => { request: '019a769b-ec31-75f8-a51e-895fb75d965b' }
[Requesting] Received request for path: /ExerciseLibrary/proposeDetails
Requesting.request {
  session: '8e744f9e-c592-4869-86e3-f23287023009',
  exercise: '019a769b-ecfa-7fec-9467-757631bdddcf',
  path: '/ExerciseLibrary/proposeDetails'
} => { request: '019a769b-ef2e-7e4c-8b16-ada14342e41e' }
ExerciseLibrary.proposeDetails {
  exercise: '019a769b-ecfa-7fec-9467-757631bdddcf',
  actorIsAdmin: true
} => {
  proposal: '019a769b-f9da-70cc-ae1b-38259edd580e',
  details: {
    videoUrl: null,
    cues: 'Stand with feet shoulder-width apart, hinge at your hips with a slight knee bend, keeping your back straight and chest up. Pull the barbell towards your lower chest/upper abdomen, squeezing your shoulder blades together. Control the weight on the way down, maintaining a neutral spine throughout the movement.',
    confidence_0_1: 0.9
  }
}
Requesting.respond {
  request: '019a769b-ef2e-7e4c-8b16-ada14342e41e',
  proposal: '019a769b-f9da-70cc-ae1b-38259edd580e',
  details: {
    videoUrl: null,
    cues: 'Stand with feet shoulder-width apart, hinge at your hips with a slight knee bend, keeping your back straight and chest up. Pull the barbell towards your lower chest/upper abdomen, squeezing your shoulder blades together. Control the weight on the way down, maintaining a neutral spine throughout the movement.',
    confidence_0_1: 0.9
  }
} => { request: '019a769b-ef2e-7e4c-8b16-ada14342e41e' }
[Requesting] Received request for path: /ExerciseLibrary/_getProposalsForExercise
Requesting.request {
  session: '8e744f9e-c592-4869-86e3-f23287023009',
  exercise: '019a769b-ecfa-7fec-9467-757631bdddcf',
  path: '/ExerciseLibrary/_getProposalsForExercise'
} => { request: '019a769b-fc0b-70a6-b802-0ff9c78cfd4a' }
Requesting.respond {
  request: '019a769b-fc0b-70a6-b802-0ff9c78cfd4a',
  results: [
    {
      _id: '019a769b-f9da-70cc-ae1b-38259edd580e',
      exercise: '019a769b-ecfa-7fec-9467-757631bdddcf',
      createdAt: '2025-11-12T05:48:44.890Z',
      videoUrl: null,
      cues: 'Stand with feet shoulder-width apart, hinge at your hips with a slight knee bend, keeping your back straight and chest up. Pull the barbell towards your lower chest/upper abdomen, squeezing your shoulder blades together. Control the weight on the way down, maintaining a neutral spine throughout the movement.',
      confidence_0_1: 0.9,
      status: 'pending'
    }
  ]
} => { request: '019a769b-fc0b-70a6-b802-0ff9c78cfd4a' }
[Requesting] Received request for path: /ExerciseLibrary/_getProposalsForExercise
Requesting.request {
  session: '8e744f9e-c592-4869-86e3-f23287023009',
  exercise: '019a769b-ecfa-7fec-9467-757631bdddcf',
  path: '/ExerciseLibrary/_getProposalsForExercise'
} => { request: '019a769b-fe8f-70a9-a99e-ee0b3bf01b46' }
Requesting.respond {
  request: '019a769b-fe8f-70a9-a99e-ee0b3bf01b46',
  results: [
    {
      _id: '019a769b-f9da-70cc-ae1b-38259edd580e',
      exercise: '019a769b-ecfa-7fec-9467-757631bdddcf',
      createdAt: '2025-11-12T05:48:44.890Z',
      videoUrl: null,
      cues: 'Stand with feet shoulder-width apart, hinge at your hips with a slight knee bend, keeping your back straight and chest up. Pull the barbell towards your lower chest/upper abdomen, squeezing your shoulder blades together. Control the weight on the way down, maintaining a neutral spine throughout the movement.',
      confidence_0_1: 0.9,
      status: 'pending'
    }
  ]
} => { request: '019a769b-fe8f-70a9-a99e-ee0b3bf01b46' }
[Requesting] Received request for path: /ExerciseLibrary/applyDetails
Requesting.request {
  session: '8e744f9e-c592-4869-86e3-f23287023009',
  proposal: '019a769b-f9da-70cc-ae1b-38259edd580e',
  path: '/ExerciseLibrary/applyDetails'
} => { request: '019a769c-09c3-7db1-bf46-a7cd52736487' }
ExerciseLibrary.applyDetails {
  proposal: '019a769b-f9da-70cc-ae1b-38259edd580e',
  actorIsAdmin: true
} => {}
Requesting.respond { request: '019a769c-09c3-7db1-bf46-a7cd52736487' } => { request: '019a769c-09c3-7db1-bf46-a7cd52736487' }
[Requesting] Received request for path: /ExerciseLibrary/_listProposals
Requesting.request {
  session: '8e744f9e-c592-4869-86e3-f23287023009',
  path: '/ExerciseLibrary/_listProposals'
} => { request: '019a769c-0d7d-7294-8ab0-922a7c311ca1' }
Requesting.respond {
  request: '019a769c-0d7d-7294-8ab0-922a7c311ca1',
  results: [
    {
      _id: '019a3d2c-6926-7924-919e-bfaf0e729184',
      exercise: '019a3d2c-44a2-7ed2-85d4-f7dd004216b8',
      createdAt: '2025-11-01T02:08:32.038Z',
      videoUrl: 'https://www.youtube.com/watch?v=eGo4IYlbE5g',
      cues: 'Grip the bar overhand, slightly wider than your shoulders, with arms fully extended. Retract your shoulder blades, brace your core, and pull your chest towards the bar until your chin clears it. Lower yourself with control to the starting position.',
      recommendedFreq: 3,
      confidence_0_1: 0.95,
      status: 'applied'
    },
    {
      _id: '019a3d2f-6e9f-766b-85c8-ff72957fa8de',
      exercise: '019a3d2f-632a-7564-8171-9cc9ea41ec27',
      createdAt: '2025-11-01T02:11:50.047Z',
      videoUrl: null,
      cues: 'Start in a strong plank position with hands slightly wider than shoulder-width, fingers pointing forward. Keep your body in a straight line from head to heels, engaging your core and glutes. Lower your chest towards the floor by bending your elbows, then push back up powerfully.',
      recommendedFreq: 3,
      confidence_0_1: 0.95,
      status: 'discarded'
    },
    {
      _id: '019a3d31-22f6-7b87-af6d-0d103fd99949',
      exercise: '019a3d31-1600-77b4-bbed-00fc3b0500c2',
      createdAt: '2025-11-01T02:13:41.750Z',
      videoUrl: null,
      cues: 'Stand tall with feet hip-width apart. Slowly lift your heels as high as possible, pushing through the balls of your feet and squeezing your calves at the top. Control the descent back down, feeling a stretch in your calves.',
      recommendedFreq: 3,
      confidence_0_1: 0.9,
      status: 'applied'
    },
    {
      _id: '019a3d66-c4c5-7e06-87dd-5f5dc8345b1d',
      exercise: '019a3d66-b6a0-770b-aecc-1d72c9bebdb5',
      createdAt: '2025-11-01T03:12:16.581Z',
      videoUrl: null,
      cues: 'Stand facing a stable box, feet hip-width apart. Load by hinging at your hips and bending your knees, then explode upwards, driving through your heels and swinging your arms to land softly on the entire foot on the box. Step down carefully one foot at a time.',
      confidence_0_1: 0.9,
      status: 'applied'
    },
    {
      _id: '019a3d81-f075-718d-b656-81eb46151ff7',
      exercise: '019a3d81-e3b2-7c9a-8240-27c9bac31510',
      createdAt: '2025-11-01T03:41:57.237Z',
      videoUrl: null,
      cues: 'Hold the kettlebell in a goblet position close to your chest. Step back with one leg, lowering your hips until both knees are bent at 90 degrees. Keep your front knee aligned over your ankle and push through your front heel to return to standing.',
      confidence_0_1: 0.9,
      status: 'applied'
    },
    {
      _id: '019a7665-f719-7ee1-a93a-75f12ffc7536',
      exercise: '019a7665-e422-7a3b-932d-613e197c54a8',
      createdAt: '2025-11-12T04:49:45.241Z',
      videoUrl: 'https://www.youtube.com/watch?v=LM8DGvWQJ3Q',
      cues: 'Set your upper back against a bench, feet flat and hip-width apart. Drive through your heels to lift your hips, squeezing your glutes hard at the top until your body forms a straight line from shoulders to knees. Control the movement down, keeping your core tight and avoiding lower back arch.',
      confidence_0_1: 0.98,
      status: 'applied'
    },
    {
      _id: '019a766a-44d8-703e-b1b1-824c23771fb4',
      exercise: '019a766a-391b-7501-a9fe-4f695247dc75',
      createdAt: '2025-11-12T04:54:27.289Z',
      videoUrl: null,
      cues: 'Start in an athletic stance with a slight forward lean, ready to explode. Drive your knees high and pump your arms powerfully to maximize acceleration and speed over the 10 yards.',
      confidence_0_1: 0.9,
      status: 'applied'
    },
    {
      _id: '019a7676-1d02-7f79-9fbd-9936b9ceb8ad',
      exercise: '019a7676-10fd-7562-bc0e-b0e7c6bea6d9',
      createdAt: '2025-11-12T05:07:23.522Z',
      videoUrl: null,
      cues: 'Lie on an incline bench with your feet flat on the floor, gripping the bar slightly wider than shoulder-width. Lower the bar slowly to your upper chest, keeping your elbows slightly tucked. Press the bar back up powerfully, extending your arms without locking your elbows, maintaining a stable back and retracted shoulder blades.',
      confidence_0_1: 1,
      status: 'applied'
    },
    {
      _id: '019a7679-f73e-7f4c-8ac2-52d82feb4477',
      exercise: '019a7679-e82e-7836-8d39-358c2d19b393',
      createdAt: '2025-11-12T05:11:35.998Z',
      videoUrl: null,
      cues: 'Kneel with ankles secured, keeping your body in a straight line from head to knees. Slowly lower your torso forward, resisting the fall primarily with your hamstrings. Control the descent as long as possible, then use your hands to push back up if needed.',
      confidence_0_1: 0.95,
      status: 'applied'
    },
    {
      _id: '019a769b-f9da-70cc-ae1b-38259edd580e',
      exercise: '019a769b-ecfa-7fec-9467-757631bdddcf',
      createdAt: '2025-11-12T05:48:44.890Z',
      videoUrl: null,
      cues: 'Stand with feet shoulder-width apart, hinge at your hips with a slight knee bend, keeping your back straight and chest up. Pull the barbell towards your lower chest/upper abdomen, squeezing your shoulder blades together. Control the weight on the way down, maintaining a neutral spine throughout the movement.',
      confidence_0_1: 0.9,
      status: 'applied'
    }
  ]
} => { request: '019a769c-0d7d-7294-8ab0-922a7c311ca1' }
[Requesting] Received request for path: /ExerciseLibrary/_getProposalsForExercise
Requesting.request {
  session: '8e744f9e-c592-4869-86e3-f23287023009',
  exercise: '019a769b-ecfa-7fec-9467-757631bdddcf',
  path: '/ExerciseLibrary/_getProposalsForExercise'
} => { request: '019a769c-1083-791a-a603-01e4ce865323' }
Requesting.respond {
  request: '019a769c-1083-791a-a603-01e4ce865323',
  results: [
    {
      _id: '019a769b-f9da-70cc-ae1b-38259edd580e',
      exercise: '019a769b-ecfa-7fec-9467-757631bdddcf',
      createdAt: '2025-11-12T05:48:44.890Z',
      videoUrl: null,
      cues: 'Stand with feet shoulder-width apart, hinge at your hips with a slight knee bend, keeping your back straight and chest up. Pull the barbell towards your lower chest/upper abdomen, squeezing your shoulder blades together. Control the weight on the way down, maintaining a neutral spine throughout the movement.',
      confidence_0_1: 0.9,
      status: 'applied'
    }
  ]
} => { request: '019a769c-1083-791a-a603-01e4ce865323' }
[Requesting] Received request for path: /ExerciseLibrary/updateExercise
Requesting.request {
  session: '8e744f9e-c592-4869-86e3-f23287023009',
  exercise: '019a769b-ecfa-7fec-9467-757631bdddcf',
  title: 'barbell rows',
  cues: 'Stand with feet shoulder-width apart, hinge at your hips with a slight knee bend, keeping your back straight and chest up. Pull the barbell towards your lower chest/upper abdomen, squeezing your shoulder blades together. Control the weight on the way down, maintaining a neutral spine throughout the movement.',
  videoUrl: null,
  path: '/ExerciseLibrary/updateExercise'
} => { request: '019a769c-15ea-7aac-88f8-1a444c32ff6b' }
ExerciseLibrary.updateExercise {
  exercise: '019a769b-ecfa-7fec-9467-757631bdddcf',
  title: 'barbell rows',
  videoUrl: null,
  cues: 'Stand with feet shoulder-width apart, hinge at your hips with a slight knee bend, keeping your back straight and chest up. Pull the barbell towards your lower chest/upper abdomen, squeezing your shoulder blades together. Control the weight on the way down, maintaining a neutral spine throughout the movement.',
  actorIsAdmin: true
} => {}
Requesting.respond { request: '019a769c-15ea-7aac-88f8-1a444c32ff6b' } => { request: '019a769c-15ea-7aac-88f8-1a444c32ff6b' }
[Requesting] Received request for path: /ExerciseLibrary/_getExerciseById
Requesting.request {
  session: '8e744f9e-c592-4869-86e3-f23287023009',
  exercise: '019a769b-ecfa-7fec-9467-757631bdddcf',
  path: '/ExerciseLibrary/_getExerciseById'
} => { request: '019a769c-1920-772c-94f9-d86f8b518eda' }
Requesting.respond {
  request: '019a769c-1920-772c-94f9-d86f8b518eda',
  results: [
    {
      _id: '019a769b-ecfa-7fec-9467-757631bdddcf',
      title: 'barbell rows',
      cues: 'Stand with feet shoulder-width apart, hinge at your hips with a slight knee bend, keeping your back straight and chest up. Pull the barbell towards your lower chest/upper abdomen, squeezing your shoulder blades together. Control the weight on the way down, maintaining a neutral spine throughout the movement.',
      deprecated: false
    }
  ]
} => { request: '019a769c-1920-772c-94f9-d86f8b518eda' }
[Requesting] Received request for path: /ExerciseLibrary/_listExercises
Requesting.request {
  session: '8e744f9e-c592-4869-86e3-f23287023009',
  includeDeprecated: true,
  path: '/ExerciseLibrary/_listExercises'
} => { request: '019a769c-1b5c-777e-b6fc-daf24cea409f' }
Requesting.respond {
  request: '019a769c-1b5c-777e-b6fc-daf24cea409f',
  results: [
    {
      _id: '019a3cfc-857e-764b-b1fa-8a3510cbdfd3',
      title: 'Squat',
      videoUrl: null,
      cues: 'squat',
      recommendedFreq: 3,
      deprecated: true
    },
    {
      _id: '019a3d0c-2985-7337-a71f-5fb98e0f7587',
      title: 'Barbell Bench Press',
      cues: '',
      recommendedFreq: 0,
      deprecated: true
    },
    {
      _id: '019a3d23-5023-7ac3-989c-7cc0408dd939',
      title: 'Bulgarian Split Squats',
      cues: '',
      recommendedFreq: 0,
      deprecated: false
    },
    {
      _id: '019a3d2c-0636-7aa8-a702-afe4fa58ad02',
      title: 'Single Leg hip bridge',
      cues: '',
      recommendedFreq: 0,
      deprecated: true
    },
    {
      _id: '019a3d2c-44a2-7ed2-85d4-f7dd004216b8',
      title: 'Pull up',
      cues: 'Grip the bar overhand, slightly wider than your shoulders, with arms fully extended. Retract your shoulder blades, brace your core, and pull your chest towards the bar until your chin clears it. Lower yourself with control to the starting position.',
      recommendedFreq: 3,
      deprecated: false,
      videoUrl: 'https://www.youtube.com/watch?v=eGo4IYlbE5g'
    },
    {
      _id: '019a3d2f-632a-7564-8171-9cc9ea41ec27',
      title: 'Push up',
      cues: 'Start in a strong plank position with hands slightly wider than shoulder-width, fingers pointing forward. Keep your body in a straight line from head to heels, engaging your core and glutes. Lower your chest towards the floor by bending your elbows, then push back up powerfully.',
      recommendedFreq: 3,
      deprecated: false
    },
    {
      _id: '019a3d31-1600-77b4-bbed-00fc3b0500c2',
      title: 'Calf raise',
      cues: 'Stand tall with feet hip-width apart. Slowly lift your heels as high as possible, pushing through the balls of your feet and squeezing your calves at the top. Control the descent back down, feeling a stretch in your calves.',
      recommendedFreq: 3,
      deprecated: false
    },
    {
      _id: '019a3d66-b6a0-770b-aecc-1d72c9bebdb5',
      title: 'Box Jump',
      cues: 'Stand facing a stable box, feet hip-width apart. Load by hinging at your hips and bending your knees, then explode upwards, driving through your heels and swinging your arms to land softly on the entire foot on the box. Step down carefully one foot at a time.',
      deprecated: false
    },
    {
      _id: '019a3d81-e3b2-7c9a-8240-27c9bac31510',
      title: 'Kettlebell lunges',
      cues: 'Hold the kettlebell in a goblet position close to your chest. Step back with one leg, lowering your hips until both knees are bent at 90 degrees. Keep your front knee aligned over your ankle and push through your front heel to return to standing.',
      deprecated: false
    },
    {
      _id: '019a7665-e422-7a3b-932d-613e197c54a8',
      title: 'Hip thrust',
      cues: 'Set your upper back against a bench, feet flat and hip-width apart. Drive through your heels to lift your hips, squeezing your glutes hard at the top until your body forms a straight line from shoulders to knees. Control the movement down, keeping your core tight and avoiding lower back arch.',
      deprecated: false,
      videoUrl: 'https://www.youtube.com/watch?v=LM8DGvWQJ3Q'
    },
    {
      _id: '019a766a-391b-7501-a9fe-4f695247dc75',
      title: '10 yard sprints',
      cues: 'Start in an athletic stance with a slight forward lean, ready to explode. Drive your knees high and pump your arms powerfully to maximize acceleration and speed over the 10 yards.',
      deprecated: false
    },
    {
      _id: '019a7676-10fd-7562-bc0e-b0e7c6bea6d9',
      title: 'incline barbell bench press',
      cues: 'Lie on an incline bench with your feet flat on the floor, gripping the bar slightly wider than shoulder-width. Lower the bar slowly to your upper chest, keeping your elbows slightly tucked. Press the bar back up powerfully, extending your arms without locking your elbows, maintaining a stable back and retracted shoulder blades.',
      deprecated: false
    },
    {
      _id: '019a7679-e82e-7836-8d39-358c2d19b393',
      title: 'nordic hamstring curl',
      cues: 'Kneel with ankles secured, keeping your body in a straight line from head to knees. Slowly lower your torso forward, resisting the fall primarily with your hamstrings. Control the descent as long as possible, then use your hands to push back up if needed.',
      deprecated: false
    },
    {
      _id: '019a769b-ecfa-7fec-9467-757631bdddcf',
      title: 'barbell rows',
      cues: 'Stand with feet shoulder-width apart, hinge at your hips with a slight knee bend, keeping your back straight and chest up. Pull the barbell towards your lower chest/upper abdomen, squeezing your shoulder blades together. Control the weight on the way down, maintaining a neutral spine throughout the movement.',
      deprecated: false
    }
  ]
} => { request: '019a769c-1b5c-777e-b6fc-daf24cea409f' }
[Requesting] Received request for path: /ExerciseLibrary/_listExercises
Requesting.request {
  session: '8e744f9e-c592-4869-86e3-f23287023009',
  includeDeprecated: true,
  path: '/ExerciseLibrary/_listExercises'
} => { request: '019a769c-1d24-752b-bcf3-0e03d215eadf' }
Requesting.respond {
  request: '019a769c-1d24-752b-bcf3-0e03d215eadf',
  results: [
    {
      _id: '019a3cfc-857e-764b-b1fa-8a3510cbdfd3',
      title: 'Squat',
      videoUrl: null,
      cues: 'squat',
      recommendedFreq: 3,
      deprecated: true
    },
    {
      _id: '019a3d0c-2985-7337-a71f-5fb98e0f7587',
      title: 'Barbell Bench Press',
      cues: '',
      recommendedFreq: 0,
      deprecated: true
    },
    {
      _id: '019a3d23-5023-7ac3-989c-7cc0408dd939',
      title: 'Bulgarian Split Squats',
      cues: '',
      recommendedFreq: 0,
      deprecated: false
    },
    {
      _id: '019a3d2c-0636-7aa8-a702-afe4fa58ad02',
      title: 'Single Leg hip bridge',
      cues: '',
      recommendedFreq: 0,
      deprecated: true
    },
    {
      _id: '019a3d2c-44a2-7ed2-85d4-f7dd004216b8',
      title: 'Pull up',
      cues: 'Grip the bar overhand, slightly wider than your shoulders, with arms fully extended. Retract your shoulder blades, brace your core, and pull your chest towards the bar until your chin clears it. Lower yourself with control to the starting position.',
      recommendedFreq: 3,
      deprecated: false,
      videoUrl: 'https://www.youtube.com/watch?v=eGo4IYlbE5g'
    },
    {
      _id: '019a3d2f-632a-7564-8171-9cc9ea41ec27',
      title: 'Push up',
      cues: 'Start in a strong plank position with hands slightly wider than shoulder-width, fingers pointing forward. Keep your body in a straight line from head to heels, engaging your core and glutes. Lower your chest towards the floor by bending your elbows, then push back up powerfully.',
      recommendedFreq: 3,
      deprecated: false
    },
    {
      _id: '019a3d31-1600-77b4-bbed-00fc3b0500c2',
      title: 'Calf raise',
      cues: 'Stand tall with feet hip-width apart. Slowly lift your heels as high as possible, pushing through the balls of your feet and squeezing your calves at the top. Control the descent back down, feeling a stretch in your calves.',
      recommendedFreq: 3,
      deprecated: false
    },
    {
      _id: '019a3d66-b6a0-770b-aecc-1d72c9bebdb5',
      title: 'Box Jump',
      cues: 'Stand facing a stable box, feet hip-width apart. Load by hinging at your hips and bending your knees, then explode upwards, driving through your heels and swinging your arms to land softly on the entire foot on the box. Step down carefully one foot at a time.',
      deprecated: false
    },
    {
      _id: '019a3d81-e3b2-7c9a-8240-27c9bac31510',
      title: 'Kettlebell lunges',
      cues: 'Hold the kettlebell in a goblet position close to your chest. Step back with one leg, lowering your hips until both knees are bent at 90 degrees. Keep your front knee aligned over your ankle and push through your front heel to return to standing.',
      deprecated: false
    },
    {
      _id: '019a7665-e422-7a3b-932d-613e197c54a8',
      title: 'Hip thrust',
      cues: 'Set your upper back against a bench, feet flat and hip-width apart. Drive through your heels to lift your hips, squeezing your glutes hard at the top until your body forms a straight line from shoulders to knees. Control the movement down, keeping your core tight and avoiding lower back arch.',
      deprecated: false,
      videoUrl: 'https://www.youtube.com/watch?v=LM8DGvWQJ3Q'
    },
    {
      _id: '019a766a-391b-7501-a9fe-4f695247dc75',
      title: '10 yard sprints',
      cues: 'Start in an athletic stance with a slight forward lean, ready to explode. Drive your knees high and pump your arms powerfully to maximize acceleration and speed over the 10 yards.',
      deprecated: false
    },
    {
      _id: '019a7676-10fd-7562-bc0e-b0e7c6bea6d9',
      title: 'incline barbell bench press',
      cues: 'Lie on an incline bench with your feet flat on the floor, gripping the bar slightly wider than shoulder-width. Lower the bar slowly to your upper chest, keeping your elbows slightly tucked. Press the bar back up powerfully, extending your arms without locking your elbows, maintaining a stable back and retracted shoulder blades.',
      deprecated: false
    },
    {
      _id: '019a7679-e82e-7836-8d39-358c2d19b393',
      title: 'nordic hamstring curl',
      cues: 'Kneel with ankles secured, keeping your body in a straight line from head to knees. Slowly lower your torso forward, resisting the fall primarily with your hamstrings. Control the descent as long as possible, then use your hands to push back up if needed.',
      deprecated: false
    },
    {
      _id: '019a769b-ecfa-7fec-9467-757631bdddcf',
      title: 'barbell rows',
      cues: 'Stand with feet shoulder-width apart, hinge at your hips with a slight knee bend, keeping your back straight and chest up. Pull the barbell towards your lower chest/upper abdomen, squeezing your shoulder blades together. Control the weight on the way down, maintaining a neutral spine throughout the movement.',
      deprecated: false
    }
  ]
} => { request: '019a769c-1d24-752b-bcf3-0e03d215eadf' }
[Requesting] Received request for path: /ExerciseLibrary/_listProposals
Requesting.request {
  session: '8e744f9e-c592-4869-86e3-f23287023009',
  path: '/ExerciseLibrary/_listProposals'
} => { request: '019a769c-1ef4-797e-9dac-472a6bd79bcf' }
Requesting.respond {
  request: '019a769c-1ef4-797e-9dac-472a6bd79bcf',
  results: [
    {
      _id: '019a3d2c-6926-7924-919e-bfaf0e729184',
      exercise: '019a3d2c-44a2-7ed2-85d4-f7dd004216b8',
      createdAt: '2025-11-01T02:08:32.038Z',
      videoUrl: 'https://www.youtube.com/watch?v=eGo4IYlbE5g',
      cues: 'Grip the bar overhand, slightly wider than your shoulders, with arms fully extended. Retract your shoulder blades, brace your core, and pull your chest towards the bar until your chin clears it. Lower yourself with control to the starting position.',
      recommendedFreq: 3,
      confidence_0_1: 0.95,
      status: 'applied'
    },
    {
      _id: '019a3d2f-6e9f-766b-85c8-ff72957fa8de',
      exercise: '019a3d2f-632a-7564-8171-9cc9ea41ec27',
      createdAt: '2025-11-01T02:11:50.047Z',
      videoUrl: null,
      cues: 'Start in a strong plank position with hands slightly wider than shoulder-width, fingers pointing forward. Keep your body in a straight line from head to heels, engaging your core and glutes. Lower your chest towards the floor by bending your elbows, then push back up powerfully.',
      recommendedFreq: 3,
      confidence_0_1: 0.95,
      status: 'discarded'
    },
    {
      _id: '019a3d31-22f6-7b87-af6d-0d103fd99949',
      exercise: '019a3d31-1600-77b4-bbed-00fc3b0500c2',
      createdAt: '2025-11-01T02:13:41.750Z',
      videoUrl: null,
      cues: 'Stand tall with feet hip-width apart. Slowly lift your heels as high as possible, pushing through the balls of your feet and squeezing your calves at the top. Control the descent back down, feeling a stretch in your calves.',
      recommendedFreq: 3,
      confidence_0_1: 0.9,
      status: 'applied'
    },
    {
      _id: '019a3d66-c4c5-7e06-87dd-5f5dc8345b1d',
      exercise: '019a3d66-b6a0-770b-aecc-1d72c9bebdb5',
      createdAt: '2025-11-01T03:12:16.581Z',
      videoUrl: null,
      cues: 'Stand facing a stable box, feet hip-width apart. Load by hinging at your hips and bending your knees, then explode upwards, driving through your heels and swinging your arms to land softly on the entire foot on the box. Step down carefully one foot at a time.',
      confidence_0_1: 0.9,
      status: 'applied'
    },
    {
      _id: '019a3d81-f075-718d-b656-81eb46151ff7',
      exercise: '019a3d81-e3b2-7c9a-8240-27c9bac31510',
      createdAt: '2025-11-01T03:41:57.237Z',
      videoUrl: null,
      cues: 'Hold the kettlebell in a goblet position close to your chest. Step back with one leg, lowering your hips until both knees are bent at 90 degrees. Keep your front knee aligned over your ankle and push through your front heel to return to standing.',
      confidence_0_1: 0.9,
      status: 'applied'
    },
    {
      _id: '019a7665-f719-7ee1-a93a-75f12ffc7536',
      exercise: '019a7665-e422-7a3b-932d-613e197c54a8',
      createdAt: '2025-11-12T04:49:45.241Z',
      videoUrl: 'https://www.youtube.com/watch?v=LM8DGvWQJ3Q',
      cues: 'Set your upper back against a bench, feet flat and hip-width apart. Drive through your heels to lift your hips, squeezing your glutes hard at the top until your body forms a straight line from shoulders to knees. Control the movement down, keeping your core tight and avoiding lower back arch.',
      confidence_0_1: 0.98,
      status: 'applied'
    },
    {
      _id: '019a766a-44d8-703e-b1b1-824c23771fb4',
      exercise: '019a766a-391b-7501-a9fe-4f695247dc75',
      createdAt: '2025-11-12T04:54:27.289Z',
      videoUrl: null,
      cues: 'Start in an athletic stance with a slight forward lean, ready to explode. Drive your knees high and pump your arms powerfully to maximize acceleration and speed over the 10 yards.',
      confidence_0_1: 0.9,
      status: 'applied'
    },
    {
      _id: '019a7676-1d02-7f79-9fbd-9936b9ceb8ad',
      exercise: '019a7676-10fd-7562-bc0e-b0e7c6bea6d9',
      createdAt: '2025-11-12T05:07:23.522Z',
      videoUrl: null,
      cues: 'Lie on an incline bench with your feet flat on the floor, gripping the bar slightly wider than shoulder-width. Lower the bar slowly to your upper chest, keeping your elbows slightly tucked. Press the bar back up powerfully, extending your arms without locking your elbows, maintaining a stable back and retracted shoulder blades.',
      confidence_0_1: 1,
      status: 'applied'
    },
    {
      _id: '019a7679-f73e-7f4c-8ac2-52d82feb4477',
      exercise: '019a7679-e82e-7836-8d39-358c2d19b393',
      createdAt: '2025-11-12T05:11:35.998Z',
      videoUrl: null,
      cues: 'Kneel with ankles secured, keeping your body in a straight line from head to knees. Slowly lower your torso forward, resisting the fall primarily with your hamstrings. Control the descent as long as possible, then use your hands to push back up if needed.',
      confidence_0_1: 0.95,
      status: 'applied'
    },
    {
      _id: '019a769b-f9da-70cc-ae1b-38259edd580e',
      exercise: '019a769b-ecfa-7fec-9467-757631bdddcf',
      createdAt: '2025-11-12T05:48:44.890Z',
      videoUrl: null,
      cues: 'Stand with feet shoulder-width apart, hinge at your hips with a slight knee bend, keeping your back straight and chest up. Pull the barbell towards your lower chest/upper abdomen, squeezing your shoulder blades together. Control the weight on the way down, maintaining a neutral spine throughout the movement.',
      confidence_0_1: 0.9,
      status: 'applied'
    }
  ]
} => { request: '019a769c-1ef4-797e-9dac-472a6bd79bcf' }
[Requesting] Received request for path: /RehabPlan/_getActivePlanByOwner
[Requesting] Received request for path: /ExerciseLibrary/_listExercises
Requesting.request {
  session: '8e744f9e-c592-4869-86e3-f23287023009',
  path: '/RehabPlan/_getActivePlanByOwner'
} => { request: '019a769c-31cb-7700-8674-36db5b2dabb8' }
Requesting.request {
  session: '8e744f9e-c592-4869-86e3-f23287023009',
  includeDeprecated: false,
  path: '/ExerciseLibrary/_listExercises'
} => { request: '019a769c-31e1-78ef-8ab2-2d701d911acf' }
[Requesting] Received request for path: /Feedback/_listMessages
Requesting.respond {
  request: '019a769c-31cb-7700-8674-36db5b2dabb8',
  results: [
    {
      _id: '019a3cf2-7185-7b31-8c15-d2defac7438a',
      owner: '019a3cf2-6fba-704f-9a16-6c7e36897904',
      archived: false,
      items: []
    }
  ]
} => { request: '019a769c-31cb-7700-8674-36db5b2dabb8' }
Requesting.respond {
  request: '019a769c-31e1-78ef-8ab2-2d701d911acf',
  results: [
    {
      _id: '019a3d23-5023-7ac3-989c-7cc0408dd939',
      title: 'Bulgarian Split Squats',
      cues: '',
      recommendedFreq: 0,
      deprecated: false
    },
    {
      _id: '019a3d2c-44a2-7ed2-85d4-f7dd004216b8',
      title: 'Pull up',
      cues: 'Grip the bar overhand, slightly wider than your shoulders, with arms fully extended. Retract your shoulder blades, brace your core, and pull your chest towards the bar until your chin clears it. Lower yourself with control to the starting position.',
      recommendedFreq: 3,
      deprecated: false,
      videoUrl: 'https://www.youtube.com/watch?v=eGo4IYlbE5g'
    },
    {
      _id: '019a3d2f-632a-7564-8171-9cc9ea41ec27',
      title: 'Push up',
      cues: 'Start in a strong plank position with hands slightly wider than shoulder-width, fingers pointing forward. Keep your body in a straight line from head to heels, engaging your core and glutes. Lower your chest towards the floor by bending your elbows, then push back up powerfully.',
      recommendedFreq: 3,
      deprecated: false
    },
    {
      _id: '019a3d31-1600-77b4-bbed-00fc3b0500c2',
      title: 'Calf raise',
      cues: 'Stand tall with feet hip-width apart. Slowly lift your heels as high as possible, pushing through the balls of your feet and squeezing your calves at the top. Control the descent back down, feeling a stretch in your calves.',
      recommendedFreq: 3,
      deprecated: false
    },
    {
      _id: '019a3d66-b6a0-770b-aecc-1d72c9bebdb5',
      title: 'Box Jump',
      cues: 'Stand facing a stable box, feet hip-width apart. Load by hinging at your hips and bending your knees, then explode upwards, driving through your heels and swinging your arms to land softly on the entire foot on the box. Step down carefully one foot at a time.',
      deprecated: false
    },
    {
      _id: '019a3d81-e3b2-7c9a-8240-27c9bac31510',
      title: 'Kettlebell lunges',
      cues: 'Hold the kettlebell in a goblet position close to your chest. Step back with one leg, lowering your hips until both knees are bent at 90 degrees. Keep your front knee aligned over your ankle and push through your front heel to return to standing.',
      deprecated: false
    },
    {
      _id: '019a7665-e422-7a3b-932d-613e197c54a8',
      title: 'Hip thrust',
      cues: 'Set your upper back against a bench, feet flat and hip-width apart. Drive through your heels to lift your hips, squeezing your glutes hard at the top until your body forms a straight line from shoulders to knees. Control the movement down, keeping your core tight and avoiding lower back arch.',
      deprecated: false,
      videoUrl: 'https://www.youtube.com/watch?v=LM8DGvWQJ3Q'
    },
    {
      _id: '019a766a-391b-7501-a9fe-4f695247dc75',
      title: '10 yard sprints',
      cues: 'Start in an athletic stance with a slight forward lean, ready to explode. Drive your knees high and pump your arms powerfully to maximize acceleration and speed over the 10 yards.',
      deprecated: false
    },
    {
      _id: '019a7676-10fd-7562-bc0e-b0e7c6bea6d9',
      title: 'incline barbell bench press',
      cues: 'Lie on an incline bench with your feet flat on the floor, gripping the bar slightly wider than shoulder-width. Lower the bar slowly to your upper chest, keeping your elbows slightly tucked. Press the bar back up powerfully, extending your arms without locking your elbows, maintaining a stable back and retracted shoulder blades.',
      deprecated: false
    },
    {
      _id: '019a7679-e82e-7836-8d39-358c2d19b393',
      title: 'nordic hamstring curl',
      cues: 'Kneel with ankles secured, keeping your body in a straight line from head to knees. Slowly lower your torso forward, resisting the fall primarily with your hamstrings. Control the descent as long as possible, then use your hands to push back up if needed.',
      deprecated: false
    },
    {
      _id: '019a769b-ecfa-7fec-9467-757631bdddcf',
      title: 'barbell rows',
      cues: 'Stand with feet shoulder-width apart, hinge at your hips with a slight knee bend, keeping your back straight and chest up. Pull the barbell towards your lower chest/upper abdomen, squeezing your shoulder blades together. Control the weight on the way down, maintaining a neutral spine throughout the movement.',
      deprecated: false
    }
  ]
} => { request: '019a769c-31e1-78ef-8ab2-2d701d911acf' }
Requesting.request {
  session: '8e744f9e-c592-4869-86e3-f23287023009',
  path: '/Feedback/_listMessages'
} => { request: '019a769c-32b1-7dc3-938d-9324f331f248' }
Requesting.respond { request: '019a769c-32b1-7dc3-938d-9324f331f248', results: [] } => { request: '019a769c-32b1-7dc3-938d-9324f331f248' }
[Requesting] Received request for path: /UserAccount/logout
Requesting.request {
  session: '8e744f9e-c592-4869-86e3-f23287023009',
  path: '/UserAccount/logout'
} => { request: '019a769c-3e5e-7bb4-bdc7-586f64361afc' }
UserAccount.logout { token: '8e744f9e-c592-4869-86e3-f23287023009' } => {}
Requesting.respond { request: '019a769c-3e5e-7bb4-bdc7-586f64361afc' } => { request: '019a769c-3e5e-7bb4-bdc7-586f64361afc' }
Requesting.respond {
  request: '019a769c-3e5e-7bb4-bdc7-586f64361afc',
  error: 'unauthenticated'
} => { request: '019a769c-3e5e-7bb4-bdc7-586f64361afc' }
UserAccount.register { username: 'paul123', password: '12345', isAdmin: false } => { user: '019a769c-6e13-742a-bc23-49b2fbaf5289' }
UserAccount.login { username: 'paul123', password: '12345' } => { token: '360284cf-b722-4c90-ab18-4cf14176cd4c' }
[Requesting] Received request for path: /UserAccount/_getUserByToken
Requesting.request {
  session: '360284cf-b722-4c90-ab18-4cf14176cd4c',
  path: '/UserAccount/_getUserByToken'
} => { request: '019a769c-70a7-79cd-b05a-e7debffc486b' }
Requesting.respond {
  request: '019a769c-70a7-79cd-b05a-e7debffc486b',
  results: [ { user: '019a769c-6e13-742a-bc23-49b2fbaf5289' } ]
} => { request: '019a769c-70a7-79cd-b05a-e7debffc486b' }
[Requesting] Received request for path: /UserAccount/_isAdmin
Requesting.request {
  session: '360284cf-b722-4c90-ab18-4cf14176cd4c',
  path: '/UserAccount/_isAdmin'
} => { request: '019a769c-7257-742e-9527-c958e56fa546' }
Requesting.respond {
  request: '019a769c-7257-742e-9527-c958e56fa546',
  results: [ { isAdmin: false } ]
} => { request: '019a769c-7257-742e-9527-c958e56fa546' }
[Requesting] Received request for path: /Feedback/_listMessages
Requesting.request {
  session: '360284cf-b722-4c90-ab18-4cf14176cd4c',
  path: '/Feedback/_listMessages'
} => { request: '019a769c-7498-7045-a755-09d4638c233d' }
Requesting.respond { request: '019a769c-7498-7045-a755-09d4638c233d', results: [] } => { request: '019a769c-7498-7045-a755-09d4638c233d' }
[Requesting] Received request for path: /ExerciseLibrary/_listExercises
[Requesting] Received request for path: /RehabPlan/_getActivePlanByOwner
Requesting.request {
  session: '360284cf-b722-4c90-ab18-4cf14176cd4c',
  path: '/RehabPlan/_getActivePlanByOwner'
} => { request: '019a769c-7d7b-78d0-9a18-f2703a1145d7' }
Requesting.request {
  session: '360284cf-b722-4c90-ab18-4cf14176cd4c',
  includeDeprecated: false,
  path: '/ExerciseLibrary/_listExercises'
} => { request: '019a769c-7d78-714e-8b8c-2f711b15bdcb' }
Requesting.respond { request: '019a769c-7d7b-78d0-9a18-f2703a1145d7', results: [] } => { request: '019a769c-7d7b-78d0-9a18-f2703a1145d7' }
Requesting.respond {
  request: '019a769c-7d78-714e-8b8c-2f711b15bdcb',
  results: [
    {
      _id: '019a3d23-5023-7ac3-989c-7cc0408dd939',
      title: 'Bulgarian Split Squats',
      cues: '',
      recommendedFreq: 0,
      deprecated: false
    },
    {
      _id: '019a3d2c-44a2-7ed2-85d4-f7dd004216b8',
      title: 'Pull up',
      cues: 'Grip the bar overhand, slightly wider than your shoulders, with arms fully extended. Retract your shoulder blades, brace your core, and pull your chest towards the bar until your chin clears it. Lower yourself with control to the starting position.',
      recommendedFreq: 3,
      deprecated: false,
      videoUrl: 'https://www.youtube.com/watch?v=eGo4IYlbE5g'
    },
    {
      _id: '019a3d2f-632a-7564-8171-9cc9ea41ec27',
      title: 'Push up',
      cues: 'Start in a strong plank position with hands slightly wider than shoulder-width, fingers pointing forward. Keep your body in a straight line from head to heels, engaging your core and glutes. Lower your chest towards the floor by bending your elbows, then push back up powerfully.',
      recommendedFreq: 3,
      deprecated: false
    },
    {
      _id: '019a3d31-1600-77b4-bbed-00fc3b0500c2',
      title: 'Calf raise',
      cues: 'Stand tall with feet hip-width apart. Slowly lift your heels as high as possible, pushing through the balls of your feet and squeezing your calves at the top. Control the descent back down, feeling a stretch in your calves.',
      recommendedFreq: 3,
      deprecated: false
    },
    {
      _id: '019a3d66-b6a0-770b-aecc-1d72c9bebdb5',
      title: 'Box Jump',
      cues: 'Stand facing a stable box, feet hip-width apart. Load by hinging at your hips and bending your knees, then explode upwards, driving through your heels and swinging your arms to land softly on the entire foot on the box. Step down carefully one foot at a time.',
      deprecated: false
    },
    {
      _id: '019a3d81-e3b2-7c9a-8240-27c9bac31510',
      title: 'Kettlebell lunges',
      cues: 'Hold the kettlebell in a goblet position close to your chest. Step back with one leg, lowering your hips until both knees are bent at 90 degrees. Keep your front knee aligned over your ankle and push through your front heel to return to standing.',
      deprecated: false
    },
    {
      _id: '019a7665-e422-7a3b-932d-613e197c54a8',
      title: 'Hip thrust',
      cues: 'Set your upper back against a bench, feet flat and hip-width apart. Drive through your heels to lift your hips, squeezing your glutes hard at the top until your body forms a straight line from shoulders to knees. Control the movement down, keeping your core tight and avoiding lower back arch.',
      deprecated: false,
      videoUrl: 'https://www.youtube.com/watch?v=LM8DGvWQJ3Q'
    },
    {
      _id: '019a766a-391b-7501-a9fe-4f695247dc75',
      title: '10 yard sprints',
      cues: 'Start in an athletic stance with a slight forward lean, ready to explode. Drive your knees high and pump your arms powerfully to maximize acceleration and speed over the 10 yards.',
      deprecated: false
    },
    {
      _id: '019a7676-10fd-7562-bc0e-b0e7c6bea6d9',
      title: 'incline barbell bench press',
      cues: 'Lie on an incline bench with your feet flat on the floor, gripping the bar slightly wider than shoulder-width. Lower the bar slowly to your upper chest, keeping your elbows slightly tucked. Press the bar back up powerfully, extending your arms without locking your elbows, maintaining a stable back and retracted shoulder blades.',
      deprecated: false
    },
    {
      _id: '019a7679-e82e-7836-8d39-358c2d19b393',
      title: 'nordic hamstring curl',
      cues: 'Kneel with ankles secured, keeping your body in a straight line from head to knees. Slowly lower your torso forward, resisting the fall primarily with your hamstrings. Control the descent as long as possible, then use your hands to push back up if needed.',
      deprecated: false
    },
    {
      _id: '019a769b-ecfa-7fec-9467-757631bdddcf',
      title: 'barbell rows',
      cues: 'Stand with feet shoulder-width apart, hinge at your hips with a slight knee bend, keeping your back straight and chest up. Pull the barbell towards your lower chest/upper abdomen, squeezing your shoulder blades together. Control the weight on the way down, maintaining a neutral spine throughout the movement.',
      deprecated: false
    }
  ]
} => { request: '019a769c-7d78-714e-8b8c-2f711b15bdcb' }
[Requesting] Received request for path: /RehabPlan/createPlan
Requesting.request {
  session: '360284cf-b722-4c90-ab18-4cf14176cd4c',
  path: '/RehabPlan/createPlan'
} => { request: '019a769c-7fc0-7087-90eb-9b173bf016e7' }
[RehabPlanConcept] Created plan for owner 019a769c-6e13-742a-bc23-49b2fbaf5289 with ID 019a769c-815a-764f-8852-2bd435fd90a4
RehabPlan.createPlan {
  actor: '019a769c-6e13-742a-bc23-49b2fbaf5289',
  owner: '019a769c-6e13-742a-bc23-49b2fbaf5289'
} => { plan: '019a769c-815a-764f-8852-2bd435fd90a4' }
Requesting.respond {
  request: '019a769c-7fc0-7087-90eb-9b173bf016e7',
  plan: '019a769c-815a-764f-8852-2bd435fd90a4'
} => { request: '019a769c-7fc0-7087-90eb-9b173bf016e7' }
[Requesting] Received request for path: /RehabPlan/_getActivePlanByOwner
Requesting.request {
  session: '360284cf-b722-4c90-ab18-4cf14176cd4c',
  path: '/RehabPlan/_getActivePlanByOwner'
} => { request: '019a769c-82af-73ab-b24a-5bea248b198b' }
Requesting.respond {
  request: '019a769c-82af-73ab-b24a-5bea248b198b',
  results: [
    {
      _id: '019a769c-815a-764f-8852-2bd435fd90a4',
      owner: '019a769c-6e13-742a-bc23-49b2fbaf5289',
      archived: false,
      items: []
    }
  ]
} => { request: '019a769c-82af-73ab-b24a-5bea248b198b' }
[Requesting] Received request for path: /RehabPlan/_getActivePlanByOwner
[Requesting] Received request for path: /ExerciseLibrary/_listExercises
Requesting.request {
  session: '360284cf-b722-4c90-ab18-4cf14176cd4c',
  includeDeprecated: false,
  path: '/ExerciseLibrary/_listExercises'
} => { request: '019a769c-8cfc-775b-b61e-59f6ce4e4484' }
Requesting.request {
  session: '360284cf-b722-4c90-ab18-4cf14176cd4c',
  path: '/RehabPlan/_getActivePlanByOwner'
} => { request: '019a769c-8cfb-77e8-a0f2-35f3b1013b54' }
[Requesting] Received request for path: /CheckIn/_getCheckInByOwnerAndDate
Requesting.request {
  session: '360284cf-b722-4c90-ab18-4cf14176cd4c',
  date: '2025-11-12',
  path: '/CheckIn/_getCheckInByOwnerAndDate'
} => { request: '019a769c-8d79-7c84-b6dd-ccc7e5b139e6' }
[Requesting] Error processing request: Binding: Symbol(owner) not found in frame: [object Object]
Requesting.respond {
  request: '019a769c-8cfc-775b-b61e-59f6ce4e4484',
  results: [
    {
      _id: '019a3d23-5023-7ac3-989c-7cc0408dd939',
      title: 'Bulgarian Split Squats',
      cues: '',
      recommendedFreq: 0,
      deprecated: false
    },
    {
      _id: '019a3d2c-44a2-7ed2-85d4-f7dd004216b8',
      title: 'Pull up',
      cues: 'Grip the bar overhand, slightly wider than your shoulders, with arms fully extended. Retract your shoulder blades, brace your core, and pull your chest towards the bar until your chin clears it. Lower yourself with control to the starting position.',
      recommendedFreq: 3,
      deprecated: false,
      videoUrl: 'https://www.youtube.com/watch?v=eGo4IYlbE5g'
    },
    {
      _id: '019a3d2f-632a-7564-8171-9cc9ea41ec27',
      title: 'Push up',
      cues: 'Start in a strong plank position with hands slightly wider than shoulder-width, fingers pointing forward. Keep your body in a straight line from head to heels, engaging your core and glutes. Lower your chest towards the floor by bending your elbows, then push back up powerfully.',
      recommendedFreq: 3,
      deprecated: false
    },
    {
      _id: '019a3d31-1600-77b4-bbed-00fc3b0500c2',
      title: 'Calf raise',
      cues: 'Stand tall with feet hip-width apart. Slowly lift your heels as high as possible, pushing through the balls of your feet and squeezing your calves at the top. Control the descent back down, feeling a stretch in your calves.',
      recommendedFreq: 3,
      deprecated: false
    },
    {
      _id: '019a3d66-b6a0-770b-aecc-1d72c9bebdb5',
      title: 'Box Jump',
      cues: 'Stand facing a stable box, feet hip-width apart. Load by hinging at your hips and bending your knees, then explode upwards, driving through your heels and swinging your arms to land softly on the entire foot on the box. Step down carefully one foot at a time.',
      deprecated: false
    },
    {
      _id: '019a3d81-e3b2-7c9a-8240-27c9bac31510',
      title: 'Kettlebell lunges',
      cues: 'Hold the kettlebell in a goblet position close to your chest. Step back with one leg, lowering your hips until both knees are bent at 90 degrees. Keep your front knee aligned over your ankle and push through your front heel to return to standing.',
      deprecated: false
    },
    {
      _id: '019a7665-e422-7a3b-932d-613e197c54a8',
      title: 'Hip thrust',
      cues: 'Set your upper back against a bench, feet flat and hip-width apart. Drive through your heels to lift your hips, squeezing your glutes hard at the top until your body forms a straight line from shoulders to knees. Control the movement down, keeping your core tight and avoiding lower back arch.',
      deprecated: false,
      videoUrl: 'https://www.youtube.com/watch?v=LM8DGvWQJ3Q'
    },
    {
      _id: '019a766a-391b-7501-a9fe-4f695247dc75',
      title: '10 yard sprints',
      cues: 'Start in an athletic stance with a slight forward lean, ready to explode. Drive your knees high and pump your arms powerfully to maximize acceleration and speed over the 10 yards.',
      deprecated: false
    },
    {
      _id: '019a7676-10fd-7562-bc0e-b0e7c6bea6d9',
      title: 'incline barbell bench press',
      cues: 'Lie on an incline bench with your feet flat on the floor, gripping the bar slightly wider than shoulder-width. Lower the bar slowly to your upper chest, keeping your elbows slightly tucked. Press the bar back up powerfully, extending your arms without locking your elbows, maintaining a stable back and retracted shoulder blades.',
      deprecated: false
    },
    {
      _id: '019a7679-e82e-7836-8d39-358c2d19b393',
      title: 'nordic hamstring curl',
      cues: 'Kneel with ankles secured, keeping your body in a straight line from head to knees. Slowly lower your torso forward, resisting the fall primarily with your hamstrings. Control the descent as long as possible, then use your hands to push back up if needed.',
      deprecated: false
    },
    {
      _id: '019a769b-ecfa-7fec-9467-757631bdddcf',
      title: 'barbell rows',
      cues: 'Stand with feet shoulder-width apart, hinge at your hips with a slight knee bend, keeping your back straight and chest up. Pull the barbell towards your lower chest/upper abdomen, squeezing your shoulder blades together. Control the weight on the way down, maintaining a neutral spine throughout the movement.',
      deprecated: false
    }
  ]
} => { request: '019a769c-8cfc-775b-b61e-59f6ce4e4484' }
Requesting.respond {
  request: '019a769c-8cfb-77e8-a0f2-35f3b1013b54',
  results: [
    {
      _id: '019a769c-815a-764f-8852-2bd435fd90a4',
      owner: '019a769c-6e13-742a-bc23-49b2fbaf5289',
      archived: false,
      items: []
    }
  ]
} => { request: '019a769c-8cfb-77e8-a0f2-35f3b1013b54' }
[Requesting] Received request for path: /ExerciseLibrary/_listExercises
[Requesting] Received request for path: /RehabPlan/_getActivePlanByOwner
Requesting.request {
  session: '360284cf-b722-4c90-ab18-4cf14176cd4c',
  includeDeprecated: false,
  path: '/ExerciseLibrary/_listExercises'
} => { request: '019a769c-94ae-7b75-bdfd-2e62c24ec273' }
Requesting.request {
  session: '360284cf-b722-4c90-ab18-4cf14176cd4c',
  path: '/RehabPlan/_getActivePlanByOwner'
} => { request: '019a769c-94b8-798e-9c7d-75521e46851e' }
Requesting.respond {
  request: '019a769c-94b8-798e-9c7d-75521e46851e',
  results: [
    {
      _id: '019a769c-815a-764f-8852-2bd435fd90a4',
      owner: '019a769c-6e13-742a-bc23-49b2fbaf5289',
      archived: false,
      items: []
    }
  ]
} => { request: '019a769c-94b8-798e-9c7d-75521e46851e' }
Requesting.respond {
  request: '019a769c-94ae-7b75-bdfd-2e62c24ec273',
  results: [
    {
      _id: '019a3d23-5023-7ac3-989c-7cc0408dd939',
      title: 'Bulgarian Split Squats',
      cues: '',
      recommendedFreq: 0,
      deprecated: false
    },
    {
      _id: '019a3d2c-44a2-7ed2-85d4-f7dd004216b8',
      title: 'Pull up',
      cues: 'Grip the bar overhand, slightly wider than your shoulders, with arms fully extended. Retract your shoulder blades, brace your core, and pull your chest towards the bar until your chin clears it. Lower yourself with control to the starting position.',
      recommendedFreq: 3,
      deprecated: false,
      videoUrl: 'https://www.youtube.com/watch?v=eGo4IYlbE5g'
    },
    {
      _id: '019a3d2f-632a-7564-8171-9cc9ea41ec27',
      title: 'Push up',
      cues: 'Start in a strong plank position with hands slightly wider than shoulder-width, fingers pointing forward. Keep your body in a straight line from head to heels, engaging your core and glutes. Lower your chest towards the floor by bending your elbows, then push back up powerfully.',
      recommendedFreq: 3,
      deprecated: false
    },
    {
      _id: '019a3d31-1600-77b4-bbed-00fc3b0500c2',
      title: 'Calf raise',
      cues: 'Stand tall with feet hip-width apart. Slowly lift your heels as high as possible, pushing through the balls of your feet and squeezing your calves at the top. Control the descent back down, feeling a stretch in your calves.',
      recommendedFreq: 3,
      deprecated: false
    },
    {
      _id: '019a3d66-b6a0-770b-aecc-1d72c9bebdb5',
      title: 'Box Jump',
      cues: 'Stand facing a stable box, feet hip-width apart. Load by hinging at your hips and bending your knees, then explode upwards, driving through your heels and swinging your arms to land softly on the entire foot on the box. Step down carefully one foot at a time.',
      deprecated: false
    },
    {
      _id: '019a3d81-e3b2-7c9a-8240-27c9bac31510',
      title: 'Kettlebell lunges',
      cues: 'Hold the kettlebell in a goblet position close to your chest. Step back with one leg, lowering your hips until both knees are bent at 90 degrees. Keep your front knee aligned over your ankle and push through your front heel to return to standing.',
      deprecated: false
    },
    {
      _id: '019a7665-e422-7a3b-932d-613e197c54a8',
      title: 'Hip thrust',
      cues: 'Set your upper back against a bench, feet flat and hip-width apart. Drive through your heels to lift your hips, squeezing your glutes hard at the top until your body forms a straight line from shoulders to knees. Control the movement down, keeping your core tight and avoiding lower back arch.',
      deprecated: false,
      videoUrl: 'https://www.youtube.com/watch?v=LM8DGvWQJ3Q'
    },
    {
      _id: '019a766a-391b-7501-a9fe-4f695247dc75',
      title: '10 yard sprints',
      cues: 'Start in an athletic stance with a slight forward lean, ready to explode. Drive your knees high and pump your arms powerfully to maximize acceleration and speed over the 10 yards.',
      deprecated: false
    },
    {
      _id: '019a7676-10fd-7562-bc0e-b0e7c6bea6d9',
      title: 'incline barbell bench press',
      cues: 'Lie on an incline bench with your feet flat on the floor, gripping the bar slightly wider than shoulder-width. Lower the bar slowly to your upper chest, keeping your elbows slightly tucked. Press the bar back up powerfully, extending your arms without locking your elbows, maintaining a stable back and retracted shoulder blades.',
      deprecated: false
    },
    {
      _id: '019a7679-e82e-7836-8d39-358c2d19b393',
      title: 'nordic hamstring curl',
      cues: 'Kneel with ankles secured, keeping your body in a straight line from head to knees. Slowly lower your torso forward, resisting the fall primarily with your hamstrings. Control the descent as long as possible, then use your hands to push back up if needed.',
      deprecated: false
    },
    {
      _id: '019a769b-ecfa-7fec-9467-757631bdddcf',
      title: 'barbell rows',
      cues: 'Stand with feet shoulder-width apart, hinge at your hips with a slight knee bend, keeping your back straight and chest up. Pull the barbell towards your lower chest/upper abdomen, squeezing your shoulder blades together. Control the weight on the way down, maintaining a neutral spine throughout the movement.',
      deprecated: false
    }
  ]
} => { request: '019a769c-94ae-7b75-bdfd-2e62c24ec273' }
[Requesting] Received request for path: /RehabPlan/addPlanItem
Requesting.request {
  session: '360284cf-b722-4c90-ab18-4cf14176cd4c',
  plan: '019a769c-815a-764f-8852-2bd435fd90a4',
  exercise: '019a769b-ecfa-7fec-9467-757631bdddcf',
  sets: 5,
  reps: 8,
  perWeek: 2,
  notes: '',
  path: '/RehabPlan/addPlanItem'
} => { request: '019a769c-af30-7403-9991-81aa1d9b85e5' }
[RehabPlanConcept] Added item 019a769b-ecfa-7fec-9467-757631bdddcf to plan 019a769c-815a-764f-8852-2bd435fd90a4.
RehabPlan.addPlanItem {
  actor: '019a769c-6e13-742a-bc23-49b2fbaf5289',
  plan: '019a769c-815a-764f-8852-2bd435fd90a4',
  exercise: '019a769b-ecfa-7fec-9467-757631bdddcf',
  perWeek: 2,
  sets: 5,
  reps: 8,
  notes: ''
} => {}
Requesting.respond { request: '019a769c-af30-7403-9991-81aa1d9b85e5' } => { request: '019a769c-af30-7403-9991-81aa1d9b85e5' }
[Requesting] Received request for path: /RehabPlan/_getActivePlanByOwner
Requesting.request {
  session: '360284cf-b722-4c90-ab18-4cf14176cd4c',
  path: '/RehabPlan/_getActivePlanByOwner'
} => { request: '019a769c-b1ae-7911-9b4d-5335935edb0d' }
Requesting.respond {
  request: '019a769c-b1ae-7911-9b4d-5335935edb0d',
  results: [
    {
      _id: '019a769c-815a-764f-8852-2bd435fd90a4',
      owner: '019a769c-6e13-742a-bc23-49b2fbaf5289',
      archived: false,
      items: [Array]
    }
  ]
} => { request: '019a769c-b1ae-7911-9b4d-5335935edb0d' }
[Requesting] Received request for path: /RehabPlan/addPlanItem
Requesting.request {
  session: '360284cf-b722-4c90-ab18-4cf14176cd4c',
  plan: '019a769c-815a-764f-8852-2bd435fd90a4',
  exercise: '019a766a-391b-7501-a9fe-4f695247dc75',
  sets: 3,
  reps: 10,
  perWeek: 2,
  notes: '',
  path: '/RehabPlan/addPlanItem'
} => { request: '019a769c-c769-7177-8011-16a6c5fcee5d' }
[RehabPlanConcept] Added item 019a766a-391b-7501-a9fe-4f695247dc75 to plan 019a769c-815a-764f-8852-2bd435fd90a4.
RehabPlan.addPlanItem {
  actor: '019a769c-6e13-742a-bc23-49b2fbaf5289',
  plan: '019a769c-815a-764f-8852-2bd435fd90a4',
  exercise: '019a766a-391b-7501-a9fe-4f695247dc75',
  perWeek: 2,
  sets: 3,
  reps: 10,
  notes: ''
} => {}
Requesting.respond { request: '019a769c-c769-7177-8011-16a6c5fcee5d' } => { request: '019a769c-c769-7177-8011-16a6c5fcee5d' }
[Requesting] Received request for path: /RehabPlan/_getActivePlanByOwner
Requesting.request {
  session: '360284cf-b722-4c90-ab18-4cf14176cd4c',
  path: '/RehabPlan/_getActivePlanByOwner'
} => { request: '019a769c-c9db-7f4e-9f5a-17d6ee8ab48f' }
Requesting.respond {
  request: '019a769c-c9db-7f4e-9f5a-17d6ee8ab48f',
  results: [
    {
      _id: '019a769c-815a-764f-8852-2bd435fd90a4',
      owner: '019a769c-6e13-742a-bc23-49b2fbaf5289',
      archived: false,
      items: [Array]
    }
  ]
} => { request: '019a769c-c9db-7f4e-9f5a-17d6ee8ab48f' }
[Requesting] Received request for path: /RehabPlan/addPlanItem
Requesting.request {
  session: '360284cf-b722-4c90-ab18-4cf14176cd4c',
  plan: '019a769c-815a-764f-8852-2bd435fd90a4',
  exercise: '019a3d81-e3b2-7c9a-8240-27c9bac31510',
  sets: 6,
  reps: 8,
  perWeek: 2,
  notes: '',
  path: '/RehabPlan/addPlanItem'
} => { request: '019a769c-e31f-7b51-a761-896111db9627' }
[RehabPlanConcept] Added item 019a3d81-e3b2-7c9a-8240-27c9bac31510 to plan 019a769c-815a-764f-8852-2bd435fd90a4.
RehabPlan.addPlanItem {
  actor: '019a769c-6e13-742a-bc23-49b2fbaf5289',
  plan: '019a769c-815a-764f-8852-2bd435fd90a4',
  exercise: '019a3d81-e3b2-7c9a-8240-27c9bac31510',
  perWeek: 2,
  sets: 6,
  reps: 8,
  notes: ''
} => {}
Requesting.respond { request: '019a769c-e31f-7b51-a761-896111db9627' } => { request: '019a769c-e31f-7b51-a761-896111db9627' }
[Requesting] Received request for path: /RehabPlan/_getActivePlanByOwner
Requesting.request {
  session: '360284cf-b722-4c90-ab18-4cf14176cd4c',
  path: '/RehabPlan/_getActivePlanByOwner'
} => { request: '019a769c-e59c-77c4-9012-5af4334a2418' }
Requesting.respond {
  request: '019a769c-e59c-77c4-9012-5af4334a2418',
  results: [
    {
      _id: '019a769c-815a-764f-8852-2bd435fd90a4',
      owner: '019a769c-6e13-742a-bc23-49b2fbaf5289',
      archived: false,
      items: [Array]
    }
  ]
} => { request: '019a769c-e59c-77c4-9012-5af4334a2418' }
[Requesting] Received request for path: /RehabPlan/_getActivePlanByOwner
Requesting.request {
  session: '360284cf-b722-4c90-ab18-4cf14176cd4c',
  path: '/RehabPlan/_getActivePlanByOwner'
} => { request: '019a769c-f0c2-709f-b03d-232006bc7d65' }
[Requesting] Received request for path: /CheckIn/_getCheckInByOwnerAndDate
[Requesting] Received request for path: /ExerciseLibrary/_listExercises
Requesting.request {
  session: '360284cf-b722-4c90-ab18-4cf14176cd4c',
  date: '2025-11-12',
  path: '/CheckIn/_getCheckInByOwnerAndDate'
} => { request: '019a769c-f123-7da8-8a1e-7fe85259d277' }
Requesting.request {
  session: '360284cf-b722-4c90-ab18-4cf14176cd4c',
  includeDeprecated: false,
  path: '/ExerciseLibrary/_listExercises'
} => { request: '019a769c-f135-72ab-b2ec-1695c819a9be' }
[Requesting] Error processing request: Binding: Symbol(owner) not found in frame: [object Object]
Requesting.respond {
  request: '019a769c-f0c2-709f-b03d-232006bc7d65',
  results: [
    {
      _id: '019a769c-815a-764f-8852-2bd435fd90a4',
      owner: '019a769c-6e13-742a-bc23-49b2fbaf5289',
      archived: false,
      items: [Array]
    }
  ]
} => { request: '019a769c-f0c2-709f-b03d-232006bc7d65' }
Requesting.respond {
  request: '019a769c-f135-72ab-b2ec-1695c819a9be',
  results: [
    {
      _id: '019a3d23-5023-7ac3-989c-7cc0408dd939',
      title: 'Bulgarian Split Squats',
      cues: '',
      recommendedFreq: 0,
      deprecated: false
    },
    {
      _id: '019a3d2c-44a2-7ed2-85d4-f7dd004216b8',
      title: 'Pull up',
      cues: 'Grip the bar overhand, slightly wider than your shoulders, with arms fully extended. Retract your shoulder blades, brace your core, and pull your chest towards the bar until your chin clears it. Lower yourself with control to the starting position.',
      recommendedFreq: 3,
      deprecated: false,
      videoUrl: 'https://www.youtube.com/watch?v=eGo4IYlbE5g'
    },
    {
      _id: '019a3d2f-632a-7564-8171-9cc9ea41ec27',
      title: 'Push up',
      cues: 'Start in a strong plank position with hands slightly wider than shoulder-width, fingers pointing forward. Keep your body in a straight line from head to heels, engaging your core and glutes. Lower your chest towards the floor by bending your elbows, then push back up powerfully.',
      recommendedFreq: 3,
      deprecated: false
    },
    {
      _id: '019a3d31-1600-77b4-bbed-00fc3b0500c2',
      title: 'Calf raise',
      cues: 'Stand tall with feet hip-width apart. Slowly lift your heels as high as possible, pushing through the balls of your feet and squeezing your calves at the top. Control the descent back down, feeling a stretch in your calves.',
      recommendedFreq: 3,
      deprecated: false
    },
    {
      _id: '019a3d66-b6a0-770b-aecc-1d72c9bebdb5',
      title: 'Box Jump',
      cues: 'Stand facing a stable box, feet hip-width apart. Load by hinging at your hips and bending your knees, then explode upwards, driving through your heels and swinging your arms to land softly on the entire foot on the box. Step down carefully one foot at a time.',
      deprecated: false
    },
    {
      _id: '019a3d81-e3b2-7c9a-8240-27c9bac31510',
      title: 'Kettlebell lunges',
      cues: 'Hold the kettlebell in a goblet position close to your chest. Step back with one leg, lowering your hips until both knees are bent at 90 degrees. Keep your front knee aligned over your ankle and push through your front heel to return to standing.',
      deprecated: false
    },
    {
      _id: '019a7665-e422-7a3b-932d-613e197c54a8',
      title: 'Hip thrust',
      cues: 'Set your upper back against a bench, feet flat and hip-width apart. Drive through your heels to lift your hips, squeezing your glutes hard at the top until your body forms a straight line from shoulders to knees. Control the movement down, keeping your core tight and avoiding lower back arch.',
      deprecated: false,
      videoUrl: 'https://www.youtube.com/watch?v=LM8DGvWQJ3Q'
    },
    {
      _id: '019a766a-391b-7501-a9fe-4f695247dc75',
      title: '10 yard sprints',
      cues: 'Start in an athletic stance with a slight forward lean, ready to explode. Drive your knees high and pump your arms powerfully to maximize acceleration and speed over the 10 yards.',
      deprecated: false
    },
    {
      _id: '019a7676-10fd-7562-bc0e-b0e7c6bea6d9',
      title: 'incline barbell bench press',
      cues: 'Lie on an incline bench with your feet flat on the floor, gripping the bar slightly wider than shoulder-width. Lower the bar slowly to your upper chest, keeping your elbows slightly tucked. Press the bar back up powerfully, extending your arms without locking your elbows, maintaining a stable back and retracted shoulder blades.',
      deprecated: false
    },
    {
      _id: '019a7679-e82e-7836-8d39-358c2d19b393',
      title: 'nordic hamstring curl',
      cues: 'Kneel with ankles secured, keeping your body in a straight line from head to knees. Slowly lower your torso forward, resisting the fall primarily with your hamstrings. Control the descent as long as possible, then use your hands to push back up if needed.',
      deprecated: false
    },
    {
      _id: '019a769b-ecfa-7fec-9467-757631bdddcf',
      title: 'barbell rows',
      cues: 'Stand with feet shoulder-width apart, hinge at your hips with a slight knee bend, keeping your back straight and chest up. Pull the barbell towards your lower chest/upper abdomen, squeezing your shoulder blades together. Control the weight on the way down, maintaining a neutral spine throughout the movement.',
      deprecated: false
    }
  ]
} => { request: '019a769c-f135-72ab-b2ec-1695c819a9be' }
[Requesting] Received request for path: /ExerciseLibrary/_listExercises
[Requesting] Received request for path: /CheckIn/_getCheckInByOwnerAndDate
Requesting.request {
  session: '360284cf-b722-4c90-ab18-4cf14176cd4c',
  includeDeprecated: false,
  path: '/ExerciseLibrary/_listExercises'
} => { request: '019a769d-0050-7cd0-985a-ae88215f04e1' }
Requesting.request {
  session: '360284cf-b722-4c90-ab18-4cf14176cd4c',
  date: '2025-11-12',
  path: '/CheckIn/_getCheckInByOwnerAndDate'
} => { request: '019a769d-0052-78bf-a0fb-ea82a18ba353' }
[Requesting] Received request for path: /RehabPlan/_getActivePlanByOwner
[Requesting] Error processing request: Binding: Symbol(owner) not found in frame: [object Object]
Requesting.request {
  session: '360284cf-b722-4c90-ab18-4cf14176cd4c',
  path: '/RehabPlan/_getActivePlanByOwner'
} => { request: '019a769d-00c6-7e85-bdb9-1b735157d777' }
Requesting.respond {
  request: '019a769d-0050-7cd0-985a-ae88215f04e1',
  results: [
    {
      _id: '019a3d23-5023-7ac3-989c-7cc0408dd939',
      title: 'Bulgarian Split Squats',
      cues: '',
      recommendedFreq: 0,
      deprecated: false
    },
    {
      _id: '019a3d2c-44a2-7ed2-85d4-f7dd004216b8',
      title: 'Pull up',
      cues: 'Grip the bar overhand, slightly wider than your shoulders, with arms fully extended. Retract your shoulder blades, brace your core, and pull your chest towards the bar until your chin clears it. Lower yourself with control to the starting position.',
      recommendedFreq: 3,
      deprecated: false,
      videoUrl: 'https://www.youtube.com/watch?v=eGo4IYlbE5g'
    },
    {
      _id: '019a3d2f-632a-7564-8171-9cc9ea41ec27',
      title: 'Push up',
      cues: 'Start in a strong plank position with hands slightly wider than shoulder-width, fingers pointing forward. Keep your body in a straight line from head to heels, engaging your core and glutes. Lower your chest towards the floor by bending your elbows, then push back up powerfully.',
      recommendedFreq: 3,
      deprecated: false
    },
    {
      _id: '019a3d31-1600-77b4-bbed-00fc3b0500c2',
      title: 'Calf raise',
      cues: 'Stand tall with feet hip-width apart. Slowly lift your heels as high as possible, pushing through the balls of your feet and squeezing your calves at the top. Control the descent back down, feeling a stretch in your calves.',
      recommendedFreq: 3,
      deprecated: false
    },
    {
      _id: '019a3d66-b6a0-770b-aecc-1d72c9bebdb5',
      title: 'Box Jump',
      cues: 'Stand facing a stable box, feet hip-width apart. Load by hinging at your hips and bending your knees, then explode upwards, driving through your heels and swinging your arms to land softly on the entire foot on the box. Step down carefully one foot at a time.',
      deprecated: false
    },
    {
      _id: '019a3d81-e3b2-7c9a-8240-27c9bac31510',
      title: 'Kettlebell lunges',
      cues: 'Hold the kettlebell in a goblet position close to your chest. Step back with one leg, lowering your hips until both knees are bent at 90 degrees. Keep your front knee aligned over your ankle and push through your front heel to return to standing.',
      deprecated: false
    },
    {
      _id: '019a7665-e422-7a3b-932d-613e197c54a8',
      title: 'Hip thrust',
      cues: 'Set your upper back against a bench, feet flat and hip-width apart. Drive through your heels to lift your hips, squeezing your glutes hard at the top until your body forms a straight line from shoulders to knees. Control the movement down, keeping your core tight and avoiding lower back arch.',
      deprecated: false,
      videoUrl: 'https://www.youtube.com/watch?v=LM8DGvWQJ3Q'
    },
    {
      _id: '019a766a-391b-7501-a9fe-4f695247dc75',
      title: '10 yard sprints',
      cues: 'Start in an athletic stance with a slight forward lean, ready to explode. Drive your knees high and pump your arms powerfully to maximize acceleration and speed over the 10 yards.',
      deprecated: false
    },
    {
      _id: '019a7676-10fd-7562-bc0e-b0e7c6bea6d9',
      title: 'incline barbell bench press',
      cues: 'Lie on an incline bench with your feet flat on the floor, gripping the bar slightly wider than shoulder-width. Lower the bar slowly to your upper chest, keeping your elbows slightly tucked. Press the bar back up powerfully, extending your arms without locking your elbows, maintaining a stable back and retracted shoulder blades.',
      deprecated: false
    },
    {
      _id: '019a7679-e82e-7836-8d39-358c2d19b393',
      title: 'nordic hamstring curl',
      cues: 'Kneel with ankles secured, keeping your body in a straight line from head to knees. Slowly lower your torso forward, resisting the fall primarily with your hamstrings. Control the descent as long as possible, then use your hands to push back up if needed.',
      deprecated: false
    },
    {
      _id: '019a769b-ecfa-7fec-9467-757631bdddcf',
      title: 'barbell rows',
      cues: 'Stand with feet shoulder-width apart, hinge at your hips with a slight knee bend, keeping your back straight and chest up. Pull the barbell towards your lower chest/upper abdomen, squeezing your shoulder blades together. Control the weight on the way down, maintaining a neutral spine throughout the movement.',
      deprecated: false
    }
  ]
} => { request: '019a769d-0050-7cd0-985a-ae88215f04e1' }
Requesting.respond {
  request: '019a769d-00c6-7e85-bdb9-1b735157d777',
  results: [
    {
      _id: '019a769c-815a-764f-8852-2bd435fd90a4',
      owner: '019a769c-6e13-742a-bc23-49b2fbaf5289',
      archived: false,
      items: [Array]
    }
  ]
} => { request: '019a769d-00c6-7e85-bdb9-1b735157d777' }
[Requesting] Received request for path: /ExerciseLibrary/_listExercises
[Requesting] Received request for path: /CheckIn/_getCheckInByOwnerAndDate
Requesting.request {
  session: '360284cf-b722-4c90-ab18-4cf14176cd4c',
  includeDeprecated: false,
  path: '/ExerciseLibrary/_listExercises'
} => { request: '019a769d-0050-7cd0-985a-ae88215f04e1' }
Requesting.request {
  session: '360284cf-b722-4c90-ab18-4cf14176cd4c',
  date: '2025-11-12',
  path: '/CheckIn/_getCheckInByOwnerAndDate'
} => { request: '019a769d-0052-78bf-a0fb-ea82a18ba353' }
[Requesting] Received request for path: /RehabPlan/_getActivePlanByOwner
[Requesting] Error processing request: Binding: Symbol(owner) not found in frame: [object Object]
Requesting.request {
  session: '360284cf-b722-4c90-ab18-4cf14176cd4c',
  path: '/RehabPlan/_getActivePlanByOwner'
} => { request: '019a769d-00c6-7e85-bdb9-1b735157d777' }
Requesting.respond {
  request: '019a769d-0050-7cd0-985a-ae88215f04e1',
  results: [
    {
      _id: '019a3d23-5023-7ac3-989c-7cc0408dd939',
      title: 'Bulgarian Split Squats',
      cues: '',
      recommendedFreq: 0,
      deprecated: false
    },
    {
      _id: '019a3d2c-44a2-7ed2-85d4-f7dd004216b8',
      title: 'Pull up',
      cues: 'Grip the bar overhand, slightly wider than your shoulders, with arms fully extended. Retract your shoulder blades, brace your core, and pull your chest towards the bar until your chin clears it. Lower yourself with control to the starting position.',
      recommendedFreq: 3,
      deprecated: false,
      videoUrl: 'https://www.youtube.com/watch?v=eGo4IYlbE5g'
    },
    {
      _id: '019a3d2f-632a-7564-8171-9cc9ea41ec27',
      title: 'Push up',
      cues: 'Start in a strong plank position with hands slightly wider than shoulder-width, fingers pointing forward. Keep your body in a straight line from head to heels, engaging your core and glutes. Lower your chest towards the floor by bending your elbows, then push back up powerfully.',
      recommendedFreq: 3,
      deprecated: false
    },
    {
      _id: '019a3d31-1600-77b4-bbed-00fc3b0500c2',
      title: 'Calf raise',
      cues: 'Stand tall with feet hip-width apart. Slowly lift your heels as high as possible, pushing through the balls of your feet and squeezing your calves at the top. Control the descent back down, feeling a stretch in your calves.',
      recommendedFreq: 3,
      deprecated: false
    },
    {
      _id: '019a3d66-b6a0-770b-aecc-1d72c9bebdb5',
      title: 'Box Jump',
      cues: 'Stand facing a stable box, feet hip-width apart. Load by hinging at your hips and bending your knees, then explode upwards, driving through your heels and swinging your arms to land softly on the entire foot on the box. Step down carefully one foot at a time.',
      deprecated: false
    },
    {
      _id: '019a3d81-e3b2-7c9a-8240-27c9bac31510',
      title: 'Kettlebell lunges',
      cues: 'Hold the kettlebell in a goblet position close to your chest. Step back with one leg, lowering your hips until both knees are bent at 90 degrees. Keep your front knee aligned over your ankle and push through your front heel to return to standing.',
      deprecated: false
    },
    {
      _id: '019a7665-e422-7a3b-932d-613e197c54a8',
      title: 'Hip thrust',
      cues: 'Set your upper back against a bench, feet flat and hip-width apart. Drive through your heels to lift your hips, squeezing your glutes hard at the top until your body forms a straight line from shoulders to knees. Control the movement down, keeping your core tight and avoiding lower back arch.',
      deprecated: false,
      videoUrl: 'https://www.youtube.com/watch?v=LM8DGvWQJ3Q'
    },
    {
      _id: '019a766a-391b-7501-a9fe-4f695247dc75',
      title: '10 yard sprints',
      cues: 'Start in an athletic stance with a slight forward lean, ready to explode. Drive your knees high and pump your arms powerfully to maximize acceleration and speed over the 10 yards.',
      deprecated: false
    },
    {
      _id: '019a7676-10fd-7562-bc0e-b0e7c6bea6d9',
      title: 'incline barbell bench press',
      cues: 'Lie on an incline bench with your feet flat on the floor, gripping the bar slightly wider than shoulder-width. Lower the bar slowly to your upper chest, keeping your elbows slightly tucked. Press the bar back up powerfully, extending your arms without locking your elbows, maintaining a stable back and retracted shoulder blades.',
      deprecated: false
    },
    {
      _id: '019a7679-e82e-7836-8d39-358c2d19b393',
      title: 'nordic hamstring curl',
      cues: 'Kneel with ankles secured, keeping your body in a straight line from head to knees. Slowly lower your torso forward, resisting the fall primarily with your hamstrings. Control the descent as long as possible, then use your hands to push back up if needed.',
      deprecated: false
    },
    {
      _id: '019a769b-ecfa-7fec-9467-757631bdddcf',
      title: 'barbell rows',
      cues: 'Stand with feet shoulder-width apart, hinge at your hips with a slight knee bend, keeping your back straight and chest up. Pull the barbell towards your lower chest/upper abdomen, squeezing your shoulder blades together. Control the weight on the way down, maintaining a neutral spine throughout the movement.',
      deprecated: false
    }
  ]
} => { request: '019a769d-0050-7cd0-985a-ae88215f04e1' }
Requesting.respond {
  request: '019a769d-00c6-7e85-bdb9-1b735157d777',
  results: [
    {
      _id: '019a769c-815a-764f-8852-2bd435fd90a4',
      owner: '019a769c-6e13-742a-bc23-49b2fbaf5289',
      archived: false,
      items: [Array]
    }
  ]
} => { request: '019a769d-00c6-7e85-bdb9-1b735157d777' }
[Requesting] Received request for path: /ExerciseLibrary/_listExercises
[Requesting] Received request for path: /CheckIn/_getCheckInByOwnerAndDate
Requesting.request {
  session: '360284cf-b722-4c90-ab18-4cf14176cd4c',
  includeDeprecated: false,
  path: '/ExerciseLibrary/_listExercises'
} => { request: '019a769d-0050-7cd0-985a-ae88215f04e1' }
Requesting.request {
  session: '360284cf-b722-4c90-ab18-4cf14176cd4c',
  date: '2025-11-12',
  path: '/CheckIn/_getCheckInByOwnerAndDate'
} => { request: '019a769d-0052-78bf-a0fb-ea82a18ba353' }
[Requesting] Received request for path: /RehabPlan/_getActivePlanByOwner
[Requesting] Error processing request: Binding: Symbol(owner) not found in frame: [object Object]
Requesting.request {
  session: '360284cf-b722-4c90-ab18-4cf14176cd4c',
  path: '/RehabPlan/_getActivePlanByOwner'
} => { request: '019a769d-00c6-7e85-bdb9-1b735157d777' }
Requesting.respond {
  request: '019a769d-0050-7cd0-985a-ae88215f04e1',
  results: [
    {
      _id: '019a3d23-5023-7ac3-989c-7cc0408dd939',
      title: 'Bulgarian Split Squats',
      cues: '',
      recommendedFreq: 0,
      deprecated: false
    },
    {
      _id: '019a3d2c-44a2-7ed2-85d4-f7dd004216b8',
      title: 'Pull up',
      cues: 'Grip the bar overhand, slightly wider than your shoulders, with arms fully extended. Retract your shoulder blades, brace your core, and pull your chest towards the bar until your chin clears it. Lower yourself with control to the starting position.',
      recommendedFreq: 3,
      deprecated: false,
      videoUrl: 'https://www.youtube.com/watch?v=eGo4IYlbE5g'
    },
    {
      _id: '019a3d2f-632a-7564-8171-9cc9ea41ec27',
      title: 'Push up',
      cues: 'Start in a strong plank position with hands slightly wider than shoulder-width, fingers pointing forward. Keep your body in a straight line from head to heels, engaging your core and glutes. Lower your chest towards the floor by bending your elbows, then push back up powerfully.',
      recommendedFreq: 3,
      deprecated: false
    },
    {
      _id: '019a3d31-1600-77b4-bbed-00fc3b0500c2',
      title: 'Calf raise',
      cues: 'Stand tall with feet hip-width apart. Slowly lift your heels as high as possible, pushing through the balls of your feet and squeezing your calves at the top. Control the descent back down, feeling a stretch in your calves.',
      recommendedFreq: 3,
      deprecated: false
    },
    {
      _id: '019a3d66-b6a0-770b-aecc-1d72c9bebdb5',
      title: 'Box Jump',
      cues: 'Stand facing a stable box, feet hip-width apart. Load by hinging at your hips and bending your knees, then explode upwards, driving through your heels and swinging your arms to land softly on the entire foot on the box. Step down carefully one foot at a time.',
      deprecated: false
    },
    {
      _id: '019a3d81-e3b2-7c9a-8240-27c9bac31510',
      title: 'Kettlebell lunges',
      cues: 'Hold the kettlebell in a goblet position close to your chest. Step back with one leg, lowering your hips until both knees are bent at 90 degrees. Keep your front knee aligned over your ankle and push through your front heel to return to standing.',
      deprecated: false
    },
    {
      _id: '019a7665-e422-7a3b-932d-613e197c54a8',
      title: 'Hip thrust',
      cues: 'Set your upper back against a bench, feet flat and hip-width apart. Drive through your heels to lift your hips, squeezing your glutes hard at the top until your body forms a straight line from shoulders to knees. Control the movement down, keeping your core tight and avoiding lower back arch.',
      deprecated: false,
      videoUrl: 'https://www.youtube.com/watch?v=LM8DGvWQJ3Q'
    },
    {
      _id: '019a766a-391b-7501-a9fe-4f695247dc75',
      title: '10 yard sprints',
      cues: 'Start in an athletic stance with a slight forward lean, ready to explode. Drive your knees high and pump your arms powerfully to maximize acceleration and speed over the 10 yards.',
      deprecated: false
    },
    {
      _id: '019a7676-10fd-7562-bc0e-b0e7c6bea6d9',
      title: 'incline barbell bench press',
      cues: 'Lie on an incline bench with your feet flat on the floor, gripping the bar slightly wider than shoulder-width. Lower the bar slowly to your upper chest, keeping your elbows slightly tucked. Press the bar back up powerfully, extending your arms without locking your elbows, maintaining a stable back and retracted shoulder blades.',
      deprecated: false
    },
    {
      _id: '019a7679-e82e-7836-8d39-358c2d19b393',
      title: 'nordic hamstring curl',
      cues: 'Kneel with ankles secured, keeping your body in a straight line from head to knees. Slowly lower your torso forward, resisting the fall primarily with your hamstrings. Control the descent as long as possible, then use your hands to push back up if needed.',
      deprecated: false
    },
    {
      _id: '019a769b-ecfa-7fec-9467-757631bdddcf',
      title: 'barbell rows',
      cues: 'Stand with feet shoulder-width apart, hinge at your hips with a slight knee bend, keeping your back straight and chest up. Pull the barbell towards your lower chest/upper abdomen, squeezing your shoulder blades together. Control the weight on the way down, maintaining a neutral spine throughout the movement.',
      deprecated: false
    }
  ]
} => { request: '019a769d-0050-7cd0-985a-ae88215f04e1' }
Requesting.respond {
  request: '019a769d-00c6-7e85-bdb9-1b735157d777',
  results: [
    {
      _id: '019a769c-815a-764f-8852-2bd435fd90a4',
      owner: '019a769c-6e13-742a-bc23-49b2fbaf5289',
      archived: false,
      items: [Array]
    }
  ]
} => { request: '019a769d-00c6-7e85-bdb9-1b735157d777' }
[Requesting] Received request for path: /ExerciseLibrary/_listExercises
[Requesting] Received request for path: /CheckIn/_getCheckInByOwnerAndDate
Requesting.request {
  session: '360284cf-b722-4c90-ab18-4cf14176cd4c',
  includeDeprecated: false,
  path: '/ExerciseLibrary/_listExercises'
} => { request: '019a769d-0050-7cd0-985a-ae88215f04e1' }
Requesting.request {
  session: '360284cf-b722-4c90-ab18-4cf14176cd4c',
  date: '2025-11-12',
  path: '/CheckIn/_getCheckInByOwnerAndDate'
} => { request: '019a769d-0052-78bf-a0fb-ea82a18ba353' }
[Requesting] Received request for path: /RehabPlan/_getActivePlanByOwner
[Requesting] Error processing request: Binding: Symbol(owner) not found in frame: [object Object]
Requesting.request {
  session: '360284cf-b722-4c90-ab18-4cf14176cd4c',
  path: '/RehabPlan/_getActivePlanByOwner'
} => { request: '019a769d-00c6-7e85-bdb9-1b735157d777' }
Requesting.respond {
  request: '019a769d-0050-7cd0-985a-ae88215f04e1',
  results: [
    {
      _id: '019a3d23-5023-7ac3-989c-7cc0408dd939',
      title: 'Bulgarian Split Squats',
      cues: '',
      recommendedFreq: 0,
      deprecated: false
    },
    {
      _id: '019a3d2c-44a2-7ed2-85d4-f7dd004216b8',
      title: 'Pull up',
      cues: 'Grip the bar overhand, slightly wider than your shoulders, with arms fully extended. Retract your shoulder blades, brace your core, and pull your chest towards the bar until your chin clears it. Lower yourself with control to the starting position.',
      recommendedFreq: 3,
      deprecated: false,
      videoUrl: 'https://www.youtube.com/watch?v=eGo4IYlbE5g'
    },
    {
      _id: '019a3d2f-632a-7564-8171-9cc9ea41ec27',
      title: 'Push up',
      cues: 'Start in a strong plank position with hands slightly wider than shoulder-width, fingers pointing forward. Keep your body in a straight line from head to heels, engaging your core and glutes. Lower your chest towards the floor by bending your elbows, then push back up powerfully.',
      recommendedFreq: 3,
      deprecated: false
    },
    {
      _id: '019a3d31-1600-77b4-bbed-00fc3b0500c2',
      title: 'Calf raise',
      cues: 'Stand tall with feet hip-width apart. Slowly lift your heels as high as possible, pushing through the balls of your feet and squeezing your calves at the top. Control the descent back down, feeling a stretch in your calves.',
      recommendedFreq: 3,
      deprecated: false
    },
    {
      _id: '019a3d66-b6a0-770b-aecc-1d72c9bebdb5',
      title: 'Box Jump',
      cues: 'Stand facing a stable box, feet hip-width apart. Load by hinging at your hips and bending your knees, then explode upwards, driving through your heels and swinging your arms to land softly on the entire foot on the box. Step down carefully one foot at a time.',
      deprecated: false
    },
    {
      _id: '019a3d81-e3b2-7c9a-8240-27c9bac31510',
      title: 'Kettlebell lunges',
      cues: 'Hold the kettlebell in a goblet position close to your chest. Step back with one leg, lowering your hips until both knees are bent at 90 degrees. Keep your front knee aligned over your ankle and push through your front heel to return to standing.',
      deprecated: false
    },
    {
      _id: '019a7665-e422-7a3b-932d-613e197c54a8',
      title: 'Hip thrust',
      cues: 'Set your upper back against a bench, feet flat and hip-width apart. Drive through your heels to lift your hips, squeezing your glutes hard at the top until your body forms a straight line from shoulders to knees. Control the movement down, keeping your core tight and avoiding lower back arch.',
      deprecated: false,
      videoUrl: 'https://www.youtube.com/watch?v=LM8DGvWQJ3Q'
    },
    {
      _id: '019a766a-391b-7501-a9fe-4f695247dc75',
      title: '10 yard sprints',
      cues: 'Start in an athletic stance with a slight forward lean, ready to explode. Drive your knees high and pump your arms powerfully to maximize acceleration and speed over the 10 yards.',
      deprecated: false
    },
    {
      _id: '019a7676-10fd-7562-bc0e-b0e7c6bea6d9',
      title: 'incline barbell bench press',
      cues: 'Lie on an incline bench with your feet flat on the floor, gripping the bar slightly wider than shoulder-width. Lower the bar slowly to your upper chest, keeping your elbows slightly tucked. Press the bar back up powerfully, extending your arms without locking your elbows, maintaining a stable back and retracted shoulder blades.',
      deprecated: false
    },
    {
      _id: '019a7679-e82e-7836-8d39-358c2d19b393',
      title: 'nordic hamstring curl',
      cues: 'Kneel with ankles secured, keeping your body in a straight line from head to knees. Slowly lower your torso forward, resisting the fall primarily with your hamstrings. Control the descent as long as possible, then use your hands to push back up if needed.',
      deprecated: false
    },
    {
      _id: '019a769b-ecfa-7fec-9467-757631bdddcf',
      title: 'barbell rows',
      cues: 'Stand with feet shoulder-width apart, hinge at your hips with a slight knee bend, keeping your back straight and chest up. Pull the barbell towards your lower chest/upper abdomen, squeezing your shoulder blades together. Control the weight on the way down, maintaining a neutral spine throughout the movement.',
      deprecated: false
    }
  ]
} => { request: '019a769d-0050-7cd0-985a-ae88215f04e1' }
Requesting.respond {
  request: '019a769d-00c6-7e85-bdb9-1b735157d777',
  results: [
    {
      _id: '019a769c-815a-764f-8852-2bd435fd90a4',
      owner: '019a769c-6e13-742a-bc23-49b2fbaf5289',
      archived: false,
      items: [Array]
    }
  ]
} => { request: '019a769d-00c6-7e85-bdb9-1b735157d777' }
[Requesting] Received request for path: /ExerciseLibrary/_listExercises
[Requesting] Received request for path: /CheckIn/_getCheckInByOwnerAndDate
Requesting.request {
  session: '360284cf-b722-4c90-ab18-4cf14176cd4c',
  includeDeprecated: false,
  path: '/ExerciseLibrary/_listExercises'
} => { request: '019a769d-0050-7cd0-985a-ae88215f04e1' }
Requesting.request {
  session: '360284cf-b722-4c90-ab18-4cf14176cd4c',
  date: '2025-11-12',
  path: '/CheckIn/_getCheckInByOwnerAndDate'
} => { request: '019a769d-0052-78bf-a0fb-ea82a18ba353' }
[Requesting] Received request for path: /RehabPlan/_getActivePlanByOwner
[Requesting] Error processing request: Binding: Symbol(owner) not found in frame: [object Object]
Requesting.request {
  session: '360284cf-b722-4c90-ab18-4cf14176cd4c',
  path: '/RehabPlan/_getActivePlanByOwner'
} => { request: '019a769d-00c6-7e85-bdb9-1b735157d777' }
Requesting.respond {
  request: '019a769d-0050-7cd0-985a-ae88215f04e1',
  results: [
    {
      _id: '019a3d23-5023-7ac3-989c-7cc0408dd939',
      title: 'Bulgarian Split Squats',
      cues: '',
      recommendedFreq: 0,
      deprecated: false
    },
    {
      _id: '019a3d2c-44a2-7ed2-85d4-f7dd004216b8',
      title: 'Pull up',
      cues: 'Grip the bar overhand, slightly wider than your shoulders, with arms fully extended. Retract your shoulder blades, brace your core, and pull your chest towards the bar until your chin clears it. Lower yourself with control to the starting position.',
      recommendedFreq: 3,
      deprecated: false,
      videoUrl: 'https://www.youtube.com/watch?v=eGo4IYlbE5g'
    },
    {
      _id: '019a3d2f-632a-7564-8171-9cc9ea41ec27',
      title: 'Push up',
      cues: 'Start in a strong plank position with hands slightly wider than shoulder-width, fingers pointing forward. Keep your body in a straight line from head to heels, engaging your core and glutes. Lower your chest towards the floor by bending your elbows, then push back up powerfully.',
      recommendedFreq: 3,
      deprecated: false
    },
    {
      _id: '019a3d31-1600-77b4-bbed-00fc3b0500c2',
      title: 'Calf raise',
      cues: 'Stand tall with feet hip-width apart. Slowly lift your heels as high as possible, pushing through the balls of your feet and squeezing your calves at the top. Control the descent back down, feeling a stretch in your calves.',
      recommendedFreq: 3,
      deprecated: false
    },
    {
      _id: '019a3d66-b6a0-770b-aecc-1d72c9bebdb5',
      title: 'Box Jump',
      cues: 'Stand facing a stable box, feet hip-width apart. Load by hinging at your hips and bending your knees, then explode upwards, driving through your heels and swinging your arms to land softly on the entire foot on the box. Step down carefully one foot at a time.',
      deprecated: false
    },
    {
      _id: '019a3d81-e3b2-7c9a-8240-27c9bac31510',
      title: 'Kettlebell lunges',
      cues: 'Hold the kettlebell in a goblet position close to your chest. Step back with one leg, lowering your hips until both knees are bent at 90 degrees. Keep your front knee aligned over your ankle and push through your front heel to return to standing.',
      deprecated: false
    },
    {
      _id: '019a7665-e422-7a3b-932d-613e197c54a8',
      title: 'Hip thrust',
      cues: 'Set your upper back against a bench, feet flat and hip-width apart. Drive through your heels to lift your hips, squeezing your glutes hard at the top until your body forms a straight line from shoulders to knees. Control the movement down, keeping your core tight and avoiding lower back arch.',
      deprecated: false,
      videoUrl: 'https://www.youtube.com/watch?v=LM8DGvWQJ3Q'
    },
    {
      _id: '019a766a-391b-7501-a9fe-4f695247dc75',
      title: '10 yard sprints',
      cues: 'Start in an athletic stance with a slight forward lean, ready to explode. Drive your knees high and pump your arms powerfully to maximize acceleration and speed over the 10 yards.',
      deprecated: false
    },
    {
      _id: '019a7676-10fd-7562-bc0e-b0e7c6bea6d9',
      title: 'incline barbell bench press',
      cues: 'Lie on an incline bench with your feet flat on the floor, gripping the bar slightly wider than shoulder-width. Lower the bar slowly to your upper chest, keeping your elbows slightly tucked. Press the bar back up powerfully, extending your arms without locking your elbows, maintaining a stable back and retracted shoulder blades.',
      deprecated: false
    },
    {
      _id: '019a7679-e82e-7836-8d39-358c2d19b393',
      title: 'nordic hamstring curl',
      cues: 'Kneel with ankles secured, keeping your body in a straight line from head to knees. Slowly lower your torso forward, resisting the fall primarily with your hamstrings. Control the descent as long as possible, then use your hands to push back up if needed.',
      deprecated: false
    },
    {
      _id: '019a769b-ecfa-7fec-9467-757631bdddcf',
      title: 'barbell rows',
      cues: 'Stand with feet shoulder-width apart, hinge at your hips with a slight knee bend, keeping your back straight and chest up. Pull the barbell towards your lower chest/upper abdomen, squeezing your shoulder blades together. Control the weight on the way down, maintaining a neutral spine throughout the movement.',
      deprecated: false
    }
  ]
} => { request: '019a769d-0050-7cd0-985a-ae88215f04e1' }
Requesting.respond {
  request: '019a769d-00c6-7e85-bdb9-1b735157d777',
  results: [
    {
      _id: '019a769c-815a-764f-8852-2bd435fd90a4',
      owner: '019a769c-6e13-742a-bc23-49b2fbaf5289',
      archived: false,
      items: [Array]
    }
  ]
} => { request: '019a769d-00c6-7e85-bdb9-1b735157d777' }
[Requesting] Received request for path: /ExerciseLibrary/_listExercises
[Requesting] Received request for path: /CheckIn/_getCheckInByOwnerAndDate
Requesting.request {
  session: '360284cf-b722-4c90-ab18-4cf14176cd4c',
  includeDeprecated: false,
  path: '/ExerciseLibrary/_listExercises'
} => { request: '019a769d-0050-7cd0-985a-ae88215f04e1' }
Requesting.request {
  session: '360284cf-b722-4c90-ab18-4cf14176cd4c',
  date: '2025-11-12',
  path: '/CheckIn/_getCheckInByOwnerAndDate'
} => { request: '019a769d-0052-78bf-a0fb-ea82a18ba353' }
[Requesting] Received request for path: /RehabPlan/_getActivePlanByOwner
[Requesting] Error processing request: Binding: Symbol(owner) not found in frame: [object Object]
Requesting.request {
  session: '360284cf-b722-4c90-ab18-4cf14176cd4c',
  path: '/RehabPlan/_getActivePlanByOwner'
} => { request: '019a769d-00c6-7e85-bdb9-1b735157d777' }
Requesting.respond {
  request: '019a769d-0050-7cd0-985a-ae88215f04e1',
  results: [
    {
      _id: '019a3d23-5023-7ac3-989c-7cc0408dd939',
      title: 'Bulgarian Split Squats',
      cues: '',
      recommendedFreq: 0,
      deprecated: false
    },
    {
      _id: '019a3d2c-44a2-7ed2-85d4-f7dd004216b8',
      title: 'Pull up',
      cues: 'Grip the bar overhand, slightly wider than your shoulders, with arms fully extended. Retract your shoulder blades, brace your core, and pull your chest towards the bar until your chin clears it. Lower yourself with control to the starting position.',
      recommendedFreq: 3,
      deprecated: false,
      videoUrl: 'https://www.youtube.com/watch?v=eGo4IYlbE5g'
    },
    {
      _id: '019a3d2f-632a-7564-8171-9cc9ea41ec27',
      title: 'Push up',
      cues: 'Start in a strong plank position with hands slightly wider than shoulder-width, fingers pointing forward. Keep your body in a straight line from head to heels, engaging your core and glutes. Lower your chest towards the floor by bending your elbows, then push back up powerfully.',
      recommendedFreq: 3,
      deprecated: false
    },
    {
      _id: '019a3d31-1600-77b4-bbed-00fc3b0500c2',
      title: 'Calf raise',
      cues: 'Stand tall with feet hip-width apart. Slowly lift your heels as high as possible, pushing through the balls of your feet and squeezing your calves at the top. Control the descent back down, feeling a stretch in your calves.',
      recommendedFreq: 3,
      deprecated: false
    },
    {
      _id: '019a3d66-b6a0-770b-aecc-1d72c9bebdb5',
      title: 'Box Jump',
      cues: 'Stand facing a stable box, feet hip-width apart. Load by hinging at your hips and bending your knees, then explode upwards, driving through your heels and swinging your arms to land softly on the entire foot on the box. Step down carefully one foot at a time.',
      deprecated: false
    },
    {
      _id: '019a3d81-e3b2-7c9a-8240-27c9bac31510',
      title: 'Kettlebell lunges',
      cues: 'Hold the kettlebell in a goblet position close to your chest. Step back with one leg, lowering your hips until both knees are bent at 90 degrees. Keep your front knee aligned over your ankle and push through your front heel to return to standing.',
      deprecated: false
    },
    {
      _id: '019a7665-e422-7a3b-932d-613e197c54a8',
      title: 'Hip thrust',
      cues: 'Set your upper back against a bench, feet flat and hip-width apart. Drive through your heels to lift your hips, squeezing your glutes hard at the top until your body forms a straight line from shoulders to knees. Control the movement down, keeping your core tight and avoiding lower back arch.',
      deprecated: false,
      videoUrl: 'https://www.youtube.com/watch?v=LM8DGvWQJ3Q'
    },
    {
      _id: '019a766a-391b-7501-a9fe-4f695247dc75',
      title: '10 yard sprints',
      cues: 'Start in an athletic stance with a slight forward lean, ready to explode. Drive your knees high and pump your arms powerfully to maximize acceleration and speed over the 10 yards.',
      deprecated: false
    },
    {
      _id: '019a7676-10fd-7562-bc0e-b0e7c6bea6d9',
      title: 'incline barbell bench press',
      cues: 'Lie on an incline bench with your feet flat on the floor, gripping the bar slightly wider than shoulder-width. Lower the bar slowly to your upper chest, keeping your elbows slightly tucked. Press the bar back up powerfully, extending your arms without locking your elbows, maintaining a stable back and retracted shoulder blades.',
      deprecated: false
    },
    {
      _id: '019a7679-e82e-7836-8d39-358c2d19b393',
      title: 'nordic hamstring curl',
      cues: 'Kneel with ankles secured, keeping your body in a straight line from head to knees. Slowly lower your torso forward, resisting the fall primarily with your hamstrings. Control the descent as long as possible, then use your hands to push back up if needed.',
      deprecated: false
    },
    {
      _id: '019a769b-ecfa-7fec-9467-757631bdddcf',
      title: 'barbell rows',
      cues: 'Stand with feet shoulder-width apart, hinge at your hips with a slight knee bend, keeping your back straight and chest up. Pull the barbell towards your lower chest/upper abdomen, squeezing your shoulder blades together. Control the weight on the way down, maintaining a neutral spine throughout the movement.',
      deprecated: false
    }
  ]
} => { request: '019a769d-0050-7cd0-985a-ae88215f04e1' }
Requesting.respond {
  request: '019a769d-00c6-7e85-bdb9-1b735157d777',
  results: [
    {
      _id: '019a769c-815a-764f-8852-2bd435fd90a4',
      owner: '019a769c-6e13-742a-bc23-49b2fbaf5289',
      archived: false,
      items: [Array]
    }
  ]
} => { request: '019a769d-00c6-7e85-bdb9-1b735157d777' }
[Requesting] Received request for path: /ExerciseLibrary/_listExercises
[Requesting] Received request for path: /CheckIn/_getCheckInByOwnerAndDate
Requesting.request {
  session: '360284cf-b722-4c90-ab18-4cf14176cd4c',
  includeDeprecated: false,
  path: '/ExerciseLibrary/_listExercises'
} => { request: '019a769d-0050-7cd0-985a-ae88215f04e1' }
Requesting.request {
  session: '360284cf-b722-4c90-ab18-4cf14176cd4c',
  date: '2025-11-12',
  path: '/CheckIn/_getCheckInByOwnerAndDate'
} => { request: '019a769d-0052-78bf-a0fb-ea82a18ba353' }
[Requesting] Received request for path: /RehabPlan/_getActivePlanByOwner
[Requesting] Error processing request: Binding: Symbol(owner) not found in frame: [object Object]
Requesting.request {
  session: '360284cf-b722-4c90-ab18-4cf14176cd4c',
  path: '/RehabPlan/_getActivePlanByOwner'
} => { request: '019a769d-00c6-7e85-bdb9-1b735157d777' }
Requesting.respond {
  request: '019a769d-0050-7cd0-985a-ae88215f04e1',
  results: [
    {
      _id: '019a3d23-5023-7ac3-989c-7cc0408dd939',
      title: 'Bulgarian Split Squats',
      cues: '',
      recommendedFreq: 0,
      deprecated: false
    },
    {
      _id: '019a3d2c-44a2-7ed2-85d4-f7dd004216b8',
      title: 'Pull up',
      cues: 'Grip the bar overhand, slightly wider than your shoulders, with arms fully extended. Retract your shoulder blades, brace your core, and pull your chest towards the bar until your chin clears it. Lower yourself with control to the starting position.',
      recommendedFreq: 3,
      deprecated: false,
      videoUrl: 'https://www.youtube.com/watch?v=eGo4IYlbE5g'
    },
    {
      _id: '019a3d2f-632a-7564-8171-9cc9ea41ec27',
      title: 'Push up',
      cues: 'Start in a strong plank position with hands slightly wider than shoulder-width, fingers pointing forward. Keep your body in a straight line from head to heels, engaging your core and glutes. Lower your chest towards the floor by bending your elbows, then push back up powerfully.',
      recommendedFreq: 3,
      deprecated: false
    },
    {
      _id: '019a3d31-1600-77b4-bbed-00fc3b0500c2',
      title: 'Calf raise',
      cues: 'Stand tall with feet hip-width apart. Slowly lift your heels as high as possible, pushing through the balls of your feet and squeezing your calves at the top. Control the descent back down, feeling a stretch in your calves.',
      recommendedFreq: 3,
      deprecated: false
    },
    {
      _id: '019a3d66-b6a0-770b-aecc-1d72c9bebdb5',
      title: 'Box Jump',
      cues: 'Stand facing a stable box, feet hip-width apart. Load by hinging at your hips and bending your knees, then explode upwards, driving through your heels and swinging your arms to land softly on the entire foot on the box. Step down carefully one foot at a time.',
      deprecated: false
    },
    {
      _id: '019a3d81-e3b2-7c9a-8240-27c9bac31510',
      title: 'Kettlebell lunges',
      cues: 'Hold the kettlebell in a goblet position close to your chest. Step back with one leg, lowering your hips until both knees are bent at 90 degrees. Keep your front knee aligned over your ankle and push through your front heel to return to standing.',
      deprecated: false
    },
    {
      _id: '019a7665-e422-7a3b-932d-613e197c54a8',
      title: 'Hip thrust',
      cues: 'Set your upper back against a bench, feet flat and hip-width apart. Drive through your heels to lift your hips, squeezing your glutes hard at the top until your body forms a straight line from shoulders to knees. Control the movement down, keeping your core tight and avoiding lower back arch.',
      deprecated: false,
      videoUrl: 'https://www.youtube.com/watch?v=LM8DGvWQJ3Q'
    },
    {
      _id: '019a766a-391b-7501-a9fe-4f695247dc75',
      title: '10 yard sprints',
      cues: 'Start in an athletic stance with a slight forward lean, ready to explode. Drive your knees high and pump your arms powerfully to maximize acceleration and speed over the 10 yards.',
      deprecated: false
    },
    {
      _id: '019a7676-10fd-7562-bc0e-b0e7c6bea6d9',
      title: 'incline barbell bench press',
      cues: 'Lie on an incline bench with your feet flat on the floor, gripping the bar slightly wider than shoulder-width. Lower the bar slowly to your upper chest, keeping your elbows slightly tucked. Press the bar back up powerfully, extending your arms without locking your elbows, maintaining a stable back and retracted shoulder blades.',
      deprecated: false
    },
    {
      _id: '019a7679-e82e-7836-8d39-358c2d19b393',
      title: 'nordic hamstring curl',
      cues: 'Kneel with ankles secured, keeping your body in a straight line from head to knees. Slowly lower your torso forward, resisting the fall primarily with your hamstrings. Control the descent as long as possible, then use your hands to push back up if needed.',
      deprecated: false
    },
    {
      _id: '019a769b-ecfa-7fec-9467-757631bdddcf',
      title: 'barbell rows',
      cues: 'Stand with feet shoulder-width apart, hinge at your hips with a slight knee bend, keeping your back straight and chest up. Pull the barbell towards your lower chest/upper abdomen, squeezing your shoulder blades together. Control the weight on the way down, maintaining a neutral spine throughout the movement.',
      deprecated: false
    }
  ]
} => { request: '019a769d-0050-7cd0-985a-ae88215f04e1' }
Requesting.respond {
  request: '019a769d-00c6-7e85-bdb9-1b735157d777',
  results: [
    {
      _id: '019a769c-815a-764f-8852-2bd435fd90a4',
      owner: '019a769c-6e13-742a-bc23-49b2fbaf5289',
      archived: false,
      items: [Array]
    }
  ]
} => { request: '019a769d-00c6-7e85-bdb9-1b735157d777' }
[Requesting] Received request for path: /CheckIn/submit
Requesting.request {
  session: '360284cf-b722-4c90-ab18-4cf14176cd4c',
  date: '2025-11-12',
  completedItems: [
    '019a769b-ecfa-7fec-9467-757631bdddcf',
    '019a766a-391b-7501-a9fe-4f695247dc75',
    '019a3d81-e3b2-7c9a-8240-27c9bac31510'
  ],
  strain_0_10: 7,
  pain_0_10: 3,
  comment: 'Test message',
  path: '/CheckIn/submit'
} => { request: '019a769d-3ac9-70d7-90d9-9a4c51dc49b8' }
CheckIn.submit {
  actor: '019a769c-6e13-742a-bc23-49b2fbaf5289',
  owner: '019a769c-6e13-742a-bc23-49b2fbaf5289',
  date: '2025-11-12',
  completedItems: [
    '019a769b-ecfa-7fec-9467-757631bdddcf',
    '019a766a-391b-7501-a9fe-4f695247dc75',
    '019a3d81-e3b2-7c9a-8240-27c9bac31510'
  ],
  strain_0_10: 7,
  pain_0_10: 3,
  comment: 'Test message'
} => { checkin: '019a769d-3bd1-728f-a7ad-bdfe63544165' }
Requesting.respond {
  request: '019a769d-3ac9-70d7-90d9-9a4c51dc49b8',
  checkin: '019a769d-3bd1-728f-a7ad-bdfe63544165'
} => { request: '019a769d-3ac9-70d7-90d9-9a4c51dc49b8' }
[Requesting] Received request for path: /Feedback/recordCompletion
Requesting.request {
  session: '360284cf-b722-4c90-ab18-4cf14176cd4c',
  date: '2025-11-12',
  completedAll: true,
  path: '/Feedback/recordCompletion'
} => { request: '019a769d-3d22-74a1-bff7-dd5d7252711e' }
Feedback.recordCompletion {
  owner: '019a769c-6e13-742a-bc23-49b2fbaf5289',
  date: 2025-11-12T00:00:00.000Z,
  completedAll: true
} => {
  summaryId: '019a769d-3de7-75c8-a9bf-5cfcaf618c43',
  streakCount: 1,
  completion7d: 0.14285714285714285
}
Requesting.respond {
  request: '019a769d-3d22-74a1-bff7-dd5d7252711e',
  summaryId: '019a769d-3de7-75c8-a9bf-5cfcaf618c43',
  streakCount: 1,
  completion7d: 0.14285714285714285
} => { request: '019a769d-3d22-74a1-bff7-dd5d7252711e' }
[Requesting] Received request for path: /ExerciseLibrary/_listExercises
[Requesting] Received request for path: /RehabPlan/_getActivePlanByOwner
[Requesting] Received request for path: /CheckIn/_getCheckInByOwnerAndDate
Requesting.request {
  session: '360284cf-b722-4c90-ab18-4cf14176cd4c',
  includeDeprecated: false,
  path: '/ExerciseLibrary/_listExercises'
} => { request: '019a769d-3f78-714a-881c-a43449034001' }
Requesting.request {
  session: '360284cf-b722-4c90-ab18-4cf14176cd4c',
  path: '/RehabPlan/_getActivePlanByOwner'
} => { request: '019a769d-3f96-7f91-87a1-823999fbd85a' }
Requesting.request {
  session: '360284cf-b722-4c90-ab18-4cf14176cd4c',
  date: '2025-11-12',
  path: '/CheckIn/_getCheckInByOwnerAndDate'
} => { request: '019a769d-3f97-7dff-b361-94c2ec288153' }
[Requesting] Error processing request: Binding: Symbol(owner) not found in frame: [object Object]
Requesting.respond {
  request: '019a769d-3f78-714a-881c-a43449034001',
  results: [
    {
      _id: '019a3d23-5023-7ac3-989c-7cc0408dd939',
      title: 'Bulgarian Split Squats',
      cues: '',
      recommendedFreq: 0,
      deprecated: false
    },
    {
      _id: '019a3d2c-44a2-7ed2-85d4-f7dd004216b8',
      title: 'Pull up',
      cues: 'Grip the bar overhand, slightly wider than your shoulders, with arms fully extended. Retract your shoulder blades, brace your core, and pull your chest towards the bar until your chin clears it. Lower yourself with control to the starting position.',
      recommendedFreq: 3,
      deprecated: false,
      videoUrl: 'https://www.youtube.com/watch?v=eGo4IYlbE5g'
    },
    {
      _id: '019a3d2f-632a-7564-8171-9cc9ea41ec27',
      title: 'Push up',
      cues: 'Start in a strong plank position with hands slightly wider than shoulder-width, fingers pointing forward. Keep your body in a straight line from head to heels, engaging your core and glutes. Lower your chest towards the floor by bending your elbows, then push back up powerfully.',
      recommendedFreq: 3,
      deprecated: false
    },
    {
      _id: '019a3d31-1600-77b4-bbed-00fc3b0500c2',
      title: 'Calf raise',
      cues: 'Stand tall with feet hip-width apart. Slowly lift your heels as high as possible, pushing through the balls of your feet and squeezing your calves at the top. Control the descent back down, feeling a stretch in your calves.',
      recommendedFreq: 3,
      deprecated: false
    },
    {
      _id: '019a3d66-b6a0-770b-aecc-1d72c9bebdb5',
      title: 'Box Jump',
      cues: 'Stand facing a stable box, feet hip-width apart. Load by hinging at your hips and bending your knees, then explode upwards, driving through your heels and swinging your arms to land softly on the entire foot on the box. Step down carefully one foot at a time.',
      deprecated: false
    },
    {
      _id: '019a3d81-e3b2-7c9a-8240-27c9bac31510',
      title: 'Kettlebell lunges',
      cues: 'Hold the kettlebell in a goblet position close to your chest. Step back with one leg, lowering your hips until both knees are bent at 90 degrees. Keep your front knee aligned over your ankle and push through your front heel to return to standing.',
      deprecated: false
    },
    {
      _id: '019a7665-e422-7a3b-932d-613e197c54a8',
      title: 'Hip thrust',
      cues: 'Set your upper back against a bench, feet flat and hip-width apart. Drive through your heels to lift your hips, squeezing your glutes hard at the top until your body forms a straight line from shoulders to knees. Control the movement down, keeping your core tight and avoiding lower back arch.',
      deprecated: false,
      videoUrl: 'https://www.youtube.com/watch?v=LM8DGvWQJ3Q'
    },
    {
      _id: '019a766a-391b-7501-a9fe-4f695247dc75',
      title: '10 yard sprints',
      cues: 'Start in an athletic stance with a slight forward lean, ready to explode. Drive your knees high and pump your arms powerfully to maximize acceleration and speed over the 10 yards.',
      deprecated: false
    },
    {
      _id: '019a7676-10fd-7562-bc0e-b0e7c6bea6d9',
      title: 'incline barbell bench press',
      cues: 'Lie on an incline bench with your feet flat on the floor, gripping the bar slightly wider than shoulder-width. Lower the bar slowly to your upper chest, keeping your elbows slightly tucked. Press the bar back up powerfully, extending your arms without locking your elbows, maintaining a stable back and retracted shoulder blades.',
      deprecated: false
    },
    {
      _id: '019a7679-e82e-7836-8d39-358c2d19b393',
      title: 'nordic hamstring curl',
      cues: 'Kneel with ankles secured, keeping your body in a straight line from head to knees. Slowly lower your torso forward, resisting the fall primarily with your hamstrings. Control the descent as long as possible, then use your hands to push back up if needed.',
      deprecated: false
    },
    {
      _id: '019a769b-ecfa-7fec-9467-757631bdddcf',
      title: 'barbell rows',
      cues: 'Stand with feet shoulder-width apart, hinge at your hips with a slight knee bend, keeping your back straight and chest up. Pull the barbell towards your lower chest/upper abdomen, squeezing your shoulder blades together. Control the weight on the way down, maintaining a neutral spine throughout the movement.',
      deprecated: false
    }
  ]
} => { request: '019a769d-3f78-714a-881c-a43449034001' }
Requesting.respond {
  request: '019a769d-3f96-7f91-87a1-823999fbd85a',
  results: [
    {
      _id: '019a769c-815a-764f-8852-2bd435fd90a4',
      owner: '019a769c-6e13-742a-bc23-49b2fbaf5289',
      archived: false,
      items: [Array]
    }
  ]
} => { request: '019a769d-3f96-7f91-87a1-823999fbd85a' }
[Requesting] Received request for path: /RehabPlan/_getActivePlanByOwner
[Requesting] Received request for path: /ExerciseLibrary/_listExercises
[Requesting] Received request for path: /CheckIn/_getCheckInByOwnerAndDate
Requesting.request {
  session: '360284cf-b722-4c90-ab18-4cf14176cd4c',
  includeDeprecated: false,
  path: '/ExerciseLibrary/_listExercises'
} => { request: '019a769d-54bb-7b99-9979-1731e6167aab' }
Requesting.request {
  session: '360284cf-b722-4c90-ab18-4cf14176cd4c',
  path: '/RehabPlan/_getActivePlanByOwner'
} => { request: '019a769d-54ba-7a01-a6e2-61572f39247b' }
Requesting.request {
  session: '360284cf-b722-4c90-ab18-4cf14176cd4c',
  date: '2025-11-12',
  path: '/CheckIn/_getCheckInByOwnerAndDate'
} => { request: '019a769d-54bd-78ba-a867-04c59936bc38' }
[Requesting] Error processing request: Binding: Symbol(owner) not found in frame: [object Object]
Requesting.respond {
  request: '019a769d-54bb-7b99-9979-1731e6167aab',
  results: [
    {
      _id: '019a3d23-5023-7ac3-989c-7cc0408dd939',
      title: 'Bulgarian Split Squats',
      cues: '',
      recommendedFreq: 0,
      deprecated: false
    },
    {
      _id: '019a3d2c-44a2-7ed2-85d4-f7dd004216b8',
      title: 'Pull up',
      cues: 'Grip the bar overhand, slightly wider than your shoulders, with arms fully extended. Retract your shoulder blades, brace your core, and pull your chest towards the bar until your chin clears it. Lower yourself with control to the starting position.',
      recommendedFreq: 3,
      deprecated: false,
      videoUrl: 'https://www.youtube.com/watch?v=eGo4IYlbE5g'
    },
    {
      _id: '019a3d2f-632a-7564-8171-9cc9ea41ec27',
      title: 'Push up',
      cues: 'Start in a strong plank position with hands slightly wider than shoulder-width, fingers pointing forward. Keep your body in a straight line from head to heels, engaging your core and glutes. Lower your chest towards the floor by bending your elbows, then push back up powerfully.',
      recommendedFreq: 3,
      deprecated: false
    },
    {
      _id: '019a3d31-1600-77b4-bbed-00fc3b0500c2',
      title: 'Calf raise',
      cues: 'Stand tall with feet hip-width apart. Slowly lift your heels as high as possible, pushing through the balls of your feet and squeezing your calves at the top. Control the descent back down, feeling a stretch in your calves.',
      recommendedFreq: 3,
      deprecated: false
    },
    {
      _id: '019a3d66-b6a0-770b-aecc-1d72c9bebdb5',
      title: 'Box Jump',
      cues: 'Stand facing a stable box, feet hip-width apart. Load by hinging at your hips and bending your knees, then explode upwards, driving through your heels and swinging your arms to land softly on the entire foot on the box. Step down carefully one foot at a time.',
      deprecated: false
    },
    {
      _id: '019a3d81-e3b2-7c9a-8240-27c9bac31510',
      title: 'Kettlebell lunges',
      cues: 'Hold the kettlebell in a goblet position close to your chest. Step back with one leg, lowering your hips until both knees are bent at 90 degrees. Keep your front knee aligned over your ankle and push through your front heel to return to standing.',
      deprecated: false
    },
    {
      _id: '019a7665-e422-7a3b-932d-613e197c54a8',
      title: 'Hip thrust',
      cues: 'Set your upper back against a bench, feet flat and hip-width apart. Drive through your heels to lift your hips, squeezing your glutes hard at the top until your body forms a straight line from shoulders to knees. Control the movement down, keeping your core tight and avoiding lower back arch.',
      deprecated: false,
      videoUrl: 'https://www.youtube.com/watch?v=LM8DGvWQJ3Q'
    },
    {
      _id: '019a766a-391b-7501-a9fe-4f695247dc75',
      title: '10 yard sprints',
      cues: 'Start in an athletic stance with a slight forward lean, ready to explode. Drive your knees high and pump your arms powerfully to maximize acceleration and speed over the 10 yards.',
      deprecated: false
    },
    {
      _id: '019a7676-10fd-7562-bc0e-b0e7c6bea6d9',
      title: 'incline barbell bench press',
      cues: 'Lie on an incline bench with your feet flat on the floor, gripping the bar slightly wider than shoulder-width. Lower the bar slowly to your upper chest, keeping your elbows slightly tucked. Press the bar back up powerfully, extending your arms without locking your elbows, maintaining a stable back and retracted shoulder blades.',
      deprecated: false
    },
    {
      _id: '019a7679-e82e-7836-8d39-358c2d19b393',
      title: 'nordic hamstring curl',
      cues: 'Kneel with ankles secured, keeping your body in a straight line from head to knees. Slowly lower your torso forward, resisting the fall primarily with your hamstrings. Control the descent as long as possible, then use your hands to push back up if needed.',
      deprecated: false
    },
    {
      _id: '019a769b-ecfa-7fec-9467-757631bdddcf',
      title: 'barbell rows',
      cues: 'Stand with feet shoulder-width apart, hinge at your hips with a slight knee bend, keeping your back straight and chest up. Pull the barbell towards your lower chest/upper abdomen, squeezing your shoulder blades together. Control the weight on the way down, maintaining a neutral spine throughout the movement.',
      deprecated: false
    }
  ]
} => { request: '019a769d-54bb-7b99-9979-1731e6167aab' }
Requesting.respond {
  request: '019a769d-54ba-7a01-a6e2-61572f39247b',
  results: [
    {
      _id: '019a769c-815a-764f-8852-2bd435fd90a4',
      owner: '019a769c-6e13-742a-bc23-49b2fbaf5289',
      archived: false,
      items: [Array]
    }
  ]
} => { request: '019a769d-54ba-7a01-a6e2-61572f39247b' }
[Requesting] Received request for path: /CheckIn/_getCheckInsByOwner
[Requesting] Received request for path: /Feedback/_getSummaryMetrics
[Requesting] Received request for path: /UserAccount/_listShareLinks
Requesting.request {
  session: '360284cf-b722-4c90-ab18-4cf14176cd4c',
  path: '/CheckIn/_getCheckInsByOwner'
} => { request: '019a769d-58ea-765f-8c89-f04933da80a5' }
Requesting.request {
  session: '360284cf-b722-4c90-ab18-4cf14176cd4c',
  path: '/Feedback/_getSummaryMetrics'
} => { request: '019a769d-58fb-7f46-b22c-03b13ac64721' }
Requesting.request {
  session: '360284cf-b722-4c90-ab18-4cf14176cd4c',
  path: '/UserAccount/_listShareLinks'
} => { request: '019a769d-5904-77de-bd3d-c08a0b8fa00b' }
[Requesting] Error processing request: Binding: Symbol(owner) not found in frame: [object Object]
Retrieved summary metrics for owner 019a769c-6e13-742a-bc23-49b2fbaf5289: Streak 1, Completion 0.14285714285714285
Requesting.respond {
  request: '019a769d-58fb-7f46-b22c-03b13ac64721',
  results: [ { streakCount: 1, completion7d: 0.14285714285714285 } ]
} => { request: '019a769d-58fb-7f46-b22c-03b13ac64721' }
Requesting.respond { request: '019a769d-5904-77de-bd3d-c08a0b8fa00b', results: [] } => { request: '019a769d-5904-77de-bd3d-c08a0b8fa00b' }
[Requesting] Received request for path: /RehabPlan/_getActivePlanByOwner
[Requesting] Received request for path: /ExerciseLibrary/_listExercises
[Requesting] Received request for path: /CheckIn/_getCheckInByOwnerAndDate
Requesting.request {
  session: '360284cf-b722-4c90-ab18-4cf14176cd4c',
  includeDeprecated: false,
  path: '/ExerciseLibrary/_listExercises'
} => { request: '019a769d-5af4-77a4-ac70-9e4f6c803302' }
Requesting.request {
  session: '360284cf-b722-4c90-ab18-4cf14176cd4c',
  path: '/RehabPlan/_getActivePlanByOwner'
} => { request: '019a769d-5af2-7ab6-9c6e-592dd8fd5398' }
Requesting.request {
  session: '360284cf-b722-4c90-ab18-4cf14176cd4c',
  date: '2025-11-12',
  path: '/CheckIn/_getCheckInByOwnerAndDate'
} => { request: '019a769d-5afc-7d32-873d-553f32461d82' }
[Requesting] Error processing request: Binding: Symbol(owner) not found in frame: [object Object]
Requesting.respond {
  request: '019a769d-5af4-77a4-ac70-9e4f6c803302',
  results: [
    {
      _id: '019a3d23-5023-7ac3-989c-7cc0408dd939',
      title: 'Bulgarian Split Squats',
      cues: '',
      recommendedFreq: 0,
      deprecated: false
    },
    {
      _id: '019a3d2c-44a2-7ed2-85d4-f7dd004216b8',
      title: 'Pull up',
      cues: 'Grip the bar overhand, slightly wider than your shoulders, with arms fully extended. Retract your shoulder blades, brace your core, and pull your chest towards the bar until your chin clears it. Lower yourself with control to the starting position.',
      recommendedFreq: 3,
      deprecated: false,
      videoUrl: 'https://www.youtube.com/watch?v=eGo4IYlbE5g'
    },
    {
      _id: '019a3d2f-632a-7564-8171-9cc9ea41ec27',
      title: 'Push up',
      cues: 'Start in a strong plank position with hands slightly wider than shoulder-width, fingers pointing forward. Keep your body in a straight line from head to heels, engaging your core and glutes. Lower your chest towards the floor by bending your elbows, then push back up powerfully.',
      recommendedFreq: 3,
      deprecated: false
    },
    {
      _id: '019a3d31-1600-77b4-bbed-00fc3b0500c2',
      title: 'Calf raise',
      cues: 'Stand tall with feet hip-width apart. Slowly lift your heels as high as possible, pushing through the balls of your feet and squeezing your calves at the top. Control the descent back down, feeling a stretch in your calves.',
      recommendedFreq: 3,
      deprecated: false
    },
    {
      _id: '019a3d66-b6a0-770b-aecc-1d72c9bebdb5',
      title: 'Box Jump',
      cues: 'Stand facing a stable box, feet hip-width apart. Load by hinging at your hips and bending your knees, then explode upwards, driving through your heels and swinging your arms to land softly on the entire foot on the box. Step down carefully one foot at a time.',
      deprecated: false
    },
    {
      _id: '019a3d81-e3b2-7c9a-8240-27c9bac31510',
      title: 'Kettlebell lunges',
      cues: 'Hold the kettlebell in a goblet position close to your chest. Step back with one leg, lowering your hips until both knees are bent at 90 degrees. Keep your front knee aligned over your ankle and push through your front heel to return to standing.',
      deprecated: false
    },
    {
      _id: '019a7665-e422-7a3b-932d-613e197c54a8',
      title: 'Hip thrust',
      cues: 'Set your upper back against a bench, feet flat and hip-width apart. Drive through your heels to lift your hips, squeezing your glutes hard at the top until your body forms a straight line from shoulders to knees. Control the movement down, keeping your core tight and avoiding lower back arch.',
      deprecated: false,
      videoUrl: 'https://www.youtube.com/watch?v=LM8DGvWQJ3Q'
    },
    {
      _id: '019a766a-391b-7501-a9fe-4f695247dc75',
      title: '10 yard sprints',
      cues: 'Start in an athletic stance with a slight forward lean, ready to explode. Drive your knees high and pump your arms powerfully to maximize acceleration and speed over the 10 yards.',
      deprecated: false
    },
    {
      _id: '019a7676-10fd-7562-bc0e-b0e7c6bea6d9',
      title: 'incline barbell bench press',
      cues: 'Lie on an incline bench with your feet flat on the floor, gripping the bar slightly wider than shoulder-width. Lower the bar slowly to your upper chest, keeping your elbows slightly tucked. Press the bar back up powerfully, extending your arms without locking your elbows, maintaining a stable back and retracted shoulder blades.',
      deprecated: false
    },
    {
      _id: '019a7679-e82e-7836-8d39-358c2d19b393',
      title: 'nordic hamstring curl',
      cues: 'Kneel with ankles secured, keeping your body in a straight line from head to knees. Slowly lower your torso forward, resisting the fall primarily with your hamstrings. Control the descent as long as possible, then use your hands to push back up if needed.',
      deprecated: false
    },
    {
      _id: '019a769b-ecfa-7fec-9467-757631bdddcf',
      title: 'barbell rows',
      cues: 'Stand with feet shoulder-width apart, hinge at your hips with a slight knee bend, keeping your back straight and chest up. Pull the barbell towards your lower chest/upper abdomen, squeezing your shoulder blades together. Control the weight on the way down, maintaining a neutral spine throughout the movement.',
      deprecated: false
    }
  ]
} => { request: '019a769d-5af4-77a4-ac70-9e4f6c803302' }
Requesting.respond {
  request: '019a769d-5af2-7ab6-9c6e-592dd8fd5398',
  results: [
    {
      _id: '019a769c-815a-764f-8852-2bd435fd90a4',
      owner: '019a769c-6e13-742a-bc23-49b2fbaf5289',
      archived: false,
      items: [Array]
    }
  ]
} => { request: '019a769d-5af2-7ab6-9c6e-592dd8fd5398' }
[Requesting] Received request for path: /CheckIn/amend
Requesting.request {
  session: '360284cf-b722-4c90-ab18-4cf14176cd4c',
  checkin: '019a769d-3bd1-728f-a7ad-bdfe63544165',
  completedItems: [
    '019a769b-ecfa-7fec-9467-757631bdddcf',
    '019a766a-391b-7501-a9fe-4f695247dc75',
    '019a3d81-e3b2-7c9a-8240-27c9bac31510'
  ],
  strain_0_10: 7,
  pain_0_10: 2,
  comment: 'Test message',
  path: '/CheckIn/amend'
} => { request: '019a769d-6ceb-73d7-87a9-86f15c193a9a' }
CheckIn.amend {
  actor: '019a769c-6e13-742a-bc23-49b2fbaf5289',
  checkin: '019a769d-3bd1-728f-a7ad-bdfe63544165',
  completedItems: [
    '019a769b-ecfa-7fec-9467-757631bdddcf',
    '019a766a-391b-7501-a9fe-4f695247dc75',
    '019a3d81-e3b2-7c9a-8240-27c9bac31510'
  ],
  strain_0_10: 7,
  pain_0_10: 2,
  comment: 'Test message'
} => {}
Requesting.respond { request: '019a769d-6ceb-73d7-87a9-86f15c193a9a' } => { request: '019a769d-6ceb-73d7-87a9-86f15c193a9a' }
[Requesting] Received request for path: /Feedback/recordCompletion
Requesting.request {
  session: '360284cf-b722-4c90-ab18-4cf14176cd4c',
  date: '2025-11-12',
  completedAll: true,
  path: '/Feedback/recordCompletion'
} => { request: '019a769d-6f72-7815-931d-6a27af1fe997' }
Feedback.recordCompletion {
  owner: '019a769c-6e13-742a-bc23-49b2fbaf5289',
  date: 2025-11-12T00:00:00.000Z,
  completedAll: true
} => {
  summaryId: '019a769d-3de7-75c8-a9bf-5cfcaf618c43',
  streakCount: 1,
  completion7d: 0.14285714285714285
}
Requesting.respond {
  request: '019a769d-6f72-7815-931d-6a27af1fe997',
  summaryId: '019a769d-3de7-75c8-a9bf-5cfcaf618c43',
  streakCount: 1,
  completion7d: 0.14285714285714285
} => { request: '019a769d-6f72-7815-931d-6a27af1fe997' }
[Requesting] Received request for path: /CheckIn/_getCheckInByOwnerAndDate
[Requesting] Received request for path: /RehabPlan/_getActivePlanByOwner
[Requesting] Received request for path: /ExerciseLibrary/_listExercises
Requesting.request {
  session: '360284cf-b722-4c90-ab18-4cf14176cd4c',
  date: '2025-11-12',
  path: '/CheckIn/_getCheckInByOwnerAndDate'
} => { request: '019a769d-71eb-751b-bfaa-87cb7dcd16e2' }
Requesting.request {
  session: '360284cf-b722-4c90-ab18-4cf14176cd4c',
  path: '/RehabPlan/_getActivePlanByOwner'
} => { request: '019a769d-71f4-703a-a69a-c2a0e0c8daec' }
Requesting.request {
  session: '360284cf-b722-4c90-ab18-4cf14176cd4c',
  includeDeprecated: false,
  path: '/ExerciseLibrary/_listExercises'
} => { request: '019a769d-7200-7c7e-b149-7d2115e377fa' }
[Requesting] Error processing request: Binding: Symbol(owner) not found in frame: [object Object]
Requesting.respond {
  request: '019a769d-71f4-703a-a69a-c2a0e0c8daec',
  results: [
    {
      _id: '019a769c-815a-764f-8852-2bd435fd90a4',
      owner: '019a769c-6e13-742a-bc23-49b2fbaf5289',
      archived: false,
      items: [Array]
    }
  ]
} => { request: '019a769d-71f4-703a-a69a-c2a0e0c8daec' }
Requesting.respond {
  request: '019a769d-7200-7c7e-b149-7d2115e377fa',
  results: [
    {
      _id: '019a3d23-5023-7ac3-989c-7cc0408dd939',
      title: 'Bulgarian Split Squats',
      cues: '',
      recommendedFreq: 0,
      deprecated: false
    },
    {
      _id: '019a3d2c-44a2-7ed2-85d4-f7dd004216b8',
      title: 'Pull up',
      cues: 'Grip the bar overhand, slightly wider than your shoulders, with arms fully extended. Retract your shoulder blades, brace your core, and pull your chest towards the bar until your chin clears it. Lower yourself with control to the starting position.',
      recommendedFreq: 3,
      deprecated: false,
      videoUrl: 'https://www.youtube.com/watch?v=eGo4IYlbE5g'
    },
    {
      _id: '019a3d2f-632a-7564-8171-9cc9ea41ec27',
      title: 'Push up',
      cues: 'Start in a strong plank position with hands slightly wider than shoulder-width, fingers pointing forward. Keep your body in a straight line from head to heels, engaging your core and glutes. Lower your chest towards the floor by bending your elbows, then push back up powerfully.',
      recommendedFreq: 3,
      deprecated: false
    },
    {
      _id: '019a3d31-1600-77b4-bbed-00fc3b0500c2',
      title: 'Calf raise',
      cues: 'Stand tall with feet hip-width apart. Slowly lift your heels as high as possible, pushing through the balls of your feet and squeezing your calves at the top. Control the descent back down, feeling a stretch in your calves.',
      recommendedFreq: 3,
      deprecated: false
    },
    {
      _id: '019a3d66-b6a0-770b-aecc-1d72c9bebdb5',
      title: 'Box Jump',
      cues: 'Stand facing a stable box, feet hip-width apart. Load by hinging at your hips and bending your knees, then explode upwards, driving through your heels and swinging your arms to land softly on the entire foot on the box. Step down carefully one foot at a time.',
      deprecated: false
    },
    {
      _id: '019a3d81-e3b2-7c9a-8240-27c9bac31510',
      title: 'Kettlebell lunges',
      cues: 'Hold the kettlebell in a goblet position close to your chest. Step back with one leg, lowering your hips until both knees are bent at 90 degrees. Keep your front knee aligned over your ankle and push through your front heel to return to standing.',
      deprecated: false
    },
    {
      _id: '019a7665-e422-7a3b-932d-613e197c54a8',
      title: 'Hip thrust',
      cues: 'Set your upper back against a bench, feet flat and hip-width apart. Drive through your heels to lift your hips, squeezing your glutes hard at the top until your body forms a straight line from shoulders to knees. Control the movement down, keeping your core tight and avoiding lower back arch.',
      deprecated: false,
      videoUrl: 'https://www.youtube.com/watch?v=LM8DGvWQJ3Q'
    },
    {
      _id: '019a766a-391b-7501-a9fe-4f695247dc75',
      title: '10 yard sprints',
      cues: 'Start in an athletic stance with a slight forward lean, ready to explode. Drive your knees high and pump your arms powerfully to maximize acceleration and speed over the 10 yards.',
      deprecated: false
    },
    {
      _id: '019a7676-10fd-7562-bc0e-b0e7c6bea6d9',
      title: 'incline barbell bench press',
      cues: 'Lie on an incline bench with your feet flat on the floor, gripping the bar slightly wider than shoulder-width. Lower the bar slowly to your upper chest, keeping your elbows slightly tucked. Press the bar back up powerfully, extending your arms without locking your elbows, maintaining a stable back and retracted shoulder blades.',
      deprecated: false
    },
    {
      _id: '019a7679-e82e-7836-8d39-358c2d19b393',
      title: 'nordic hamstring curl',
      cues: 'Kneel with ankles secured, keeping your body in a straight line from head to knees. Slowly lower your torso forward, resisting the fall primarily with your hamstrings. Control the descent as long as possible, then use your hands to push back up if needed.',
      deprecated: false
    },
    {
      _id: '019a769b-ecfa-7fec-9467-757631bdddcf',
      title: 'barbell rows',
      cues: 'Stand with feet shoulder-width apart, hinge at your hips with a slight knee bend, keeping your back straight and chest up. Pull the barbell towards your lower chest/upper abdomen, squeezing your shoulder blades together. Control the weight on the way down, maintaining a neutral spine throughout the movement.',
      deprecated: false
    }
  ]
} => { request: '019a769d-7200-7c7e-b149-7d2115e377fa' }
[Requesting] Received request for path: /Feedback/_listMessages
Requesting.request {
  session: '360284cf-b722-4c90-ab18-4cf14176cd4c',
  path: '/Feedback/_listMessages'
} => { request: '019a769d-7b25-7e49-988a-c5d501cdcdfb' }
Requesting.respond { request: '019a769d-7b25-7e49-988a-c5d501cdcdfb', results: [] } => { request: '019a769d-7b25-7e49-988a-c5d501cdcdfb' }
[Requesting] Received request for path: /UserAccount/_listShareLinks
[Requesting] Received request for path: /CheckIn/_getCheckInsByOwner
Requesting.request {
  session: '360284cf-b722-4c90-ab18-4cf14176cd4c',
  path: '/UserAccount/_listShareLinks'
} => { request: '019a769d-7d05-70a1-9731-3fe275d80241' }
Requesting.request {
  session: '360284cf-b722-4c90-ab18-4cf14176cd4c',
  path: '/CheckIn/_getCheckInsByOwner'
} => { request: '019a769d-7d0b-7dc6-a831-1ebfc6c579d2' }
[Requesting] Error processing request: Binding: Symbol(owner) not found in frame: [object Object]
[Requesting] Received request for path: /Feedback/_getSummaryMetrics
Requesting.request {
  session: '360284cf-b722-4c90-ab18-4cf14176cd4c',
  path: '/Feedback/_getSummaryMetrics'
} => { request: '019a769d-7d96-7634-94f2-a927be67cf44' }
Requesting.respond { request: '019a769d-7d05-70a1-9731-3fe275d80241', results: [] } => { request: '019a769d-7d05-70a1-9731-3fe275d80241' }
Retrieved summary metrics for owner 019a769c-6e13-742a-bc23-49b2fbaf5289: Streak 1, Completion 0.14285714285714285
Requesting.respond {
  request: '019a769d-7d96-7634-94f2-a927be67cf44',
  results: [ { streakCount: 1, completion7d: 0.14285714285714285 } ]
} => { request: '019a769d-7d96-7634-94f2-a927be67cf44' }
[Requesting] Received request for path: /UserAccount/createShareLink
Requesting.request {
  session: '360284cf-b722-4c90-ab18-4cf14176cd4c',
  ttlSeconds: 604800,
  path: '/UserAccount/createShareLink'
} => { request: '019a769d-abce-7bc8-a4c5-e44fe03b9878' }
UserAccount.createShareLink { owner: '019a769c-6e13-742a-bc23-49b2fbaf5289', ttlSeconds: 604800 } => { token: 'fa54fe7d-7f65-4656-8902-e86e6cacaff0' }
Requesting.respond {
  request: '019a769d-abce-7bc8-a4c5-e44fe03b9878',
  token: 'fa54fe7d-7f65-4656-8902-e86e6cacaff0'
} => { request: '019a769d-abce-7bc8-a4c5-e44fe03b9878' }
[Requesting] Received request for path: /UserAccount/_listShareLinks
Requesting.request {
  session: '360284cf-b722-4c90-ab18-4cf14176cd4c',
  path: '/UserAccount/_listShareLinks'
} => { request: '019a769d-ae7e-7f14-a273-8f37f7af8c7d' }
Requesting.respond {
  request: '019a769d-ae7e-7f14-a273-8f37f7af8c7d',
  results: [
    {
      shareLink: '019a769d-ac91-7cd5-b9f2-bebec0fe8fe0',
      token: 'fa54fe7d-7f65-4656-8902-e86e6cacaff0',
      expiry: '2025-11-19T05:50:36.177Z',
      expired: false
    }
  ]
} => { request: '019a769d-ae7e-7f14-a273-8f37f7af8c7d' }