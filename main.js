//AXIOS GLOBAL take token value from jwt.io
axios.defaults.headers.common['X-Auth-Token'] = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

// GET REQUEST
function getTodos() {
    //Two ways we can declare axios  and inorder to pass data into it we need {enter in curly braces like object}
    //1.
    // axios({
    //     method:'get',
    //     url:'https://jsonplaceholder.typicode.com/todos',
    //     params:{
    //         _limit:5 //this will limit the no. of lines to 5 in o/p
    //     }
    // })
    // .then(res => showOutput(res)) //we already having fn to display so using this instead of console.log
    // .catch(err => console.error(err))

    //2. By default it is always 'get' so .get is not required however for clean code practice to put it
    axios
    .get('https://jsonplaceholder.typicode.com/todos?_limit=5' ,{
        timeout : 5000
    }) //to limit use ?_limit=number
    .then(res => showOutput(res))
    .catch(err => console.error(err))
  }
  
  // POST REQUEST
  function addTodo() {
    //This also has 2 ways
    //1.
//     axios({
//         method:'post',
//         url:'https://jsonplaceholder.typicode.com/todos',
//         data:{
//             title:'New todo',
//             completed: false
//         }
//     })
//     .then(res => showOutput(res))
//     .catch(err => console.error(err));
//   }
    //2.
    axios
    .post('https://jsonplaceholder.typicode.com/todos',{
            title:'New todo',
            completed: false
        })
    .then(res => showOutput(res))
    .catch(err => console.error(err));
  }
  
  // PUT/PATCH REQUEST
  function updateTodo() {
    //PUT will update entire thing here it replace entire userID
    // axios
    // .put('https://jsonplaceholder.typicode.com/todos/1',{       // '/1' in put is ID that we need to insert everytime
    //         title:'Updated todo',
    //         completed: true
    //     })
    // .then(res => showOutput(res))
    // .catch(err => console.error(err));

    //PATCH will not change the userID but inly the title and completed contents
    axios
    .patch('https://jsonplaceholder.typicode.com/todos/1',{
            title:'Updated todo',
            completed: true
        })
    .then(res => showOutput(res))
    .catch(err => console.error(err));
  }
  
  // DELETE REQUEST
  function removeTodo() {
    axios
    .delete('https://jsonplaceholder.typicode.com/todos/1')
    .then(res => showOutput(res))
    .catch(err => console.error(err));
  }
  
  // SIMULTANEOUS DATA
  function getData() {
    //here we are going to get data from 'todos' and another from 'posts'
    //traditional approach is to get it from using todos.then(posts) but efficienr approach
    //is using axios.all [in an array] which will return if all the promises are passed
    axios.all([
        axios.get('https://jsonplaceholder.typicode.com/todos?_limit=5'),
        axios.get('https://jsonplaceholder.typicode.com/posts?_limit=5')   //we will keep adding more in future
    ])
    // .then(res =>{
    //     console.log(res[0]);   //since it is an array
    //     console.log(res[1]);
    //      showOutput(res[0]);
    // })
    //to make it simple use .spread
    .then(axios.spread((todos,posts)=>showOutput(posts)))
    .catch(err => console.error(err));
  }
  
  // CUSTOM HEADERS
  function customHeaders() {
    //same as POST but here we are adding custom header
    const config = {
        headers:{
            'Content-type':'application/json',
            Authorization: 'sometoken'
        }
    };

    //pass config as another parameter
    axios
    .post('https://jsonplaceholder.typicode.com/todos',
    {
        title:'New todo',
        completed: false
    },
    config
    )
    .then(res => showOutput(res))
    .catch(err => console.error(err));
  }
  
  // TRANSFORMING REQUESTS & RESPONSES
  function transformResponse() {
    const options = {
        method:'post',
        url:'https://jsonplaceholder.typicode.com/todos',
        data:{
            title:'Hello World'
        },
        transformResponse: axios.defaults.transformResponse.concat(data=>{
            data.title = data.title.toUpperCase();
            return data;
        })
    };
    axios(options).then(res => showOutput(res));
  }
  
  // ERROR HANDLING
  function errorHandling() {
    //we are going to change error section
    axios
    .get('https://jsonplaceholder.typicode.com/todoss',
    // {
    //     validateStatus: function(status){
    //         return status < 500; //reject only if status is greater than or equal to 500
    //     }
    // }
    ) //adding s to todo as it will give 404 error
    .then(res => showOutput(res))
    .catch(err =>{
        if(err.response){
            //server responded with a status order other than 200 range
            console.log(err.response.data);
            console.log(err.response.status);
            console.log(err.response.headers)
        }

        if(err.response.status === 404){
            alert('Error:Page Not Found');
        } else if(err.request){
            //Request was made but no response
            console.error(err.request);
        } else {
            console.error(err.message);
        }
    });
  }
  
  // CANCEL TOKEN
  function cancelToken() {
    const source = axios.CancelToken.source();
    axios
    .get('https://jsonplaceholder.typicode.com/todos',{
        cancelToken: source.token
    })
    .then(res => showOutput(res))
    .catch(thrown =>{
        if(axios.isCancel(thrown)){
            console.log('Request Cancelled',thrown.message)
        }
    });
    if(true){
        source.cancel('Request Cancelled!');
    }
  }
  
  // INTERCEPTING REQUESTS & RESPONSES
  //this is display o/p in console
  axios.interceptors.request.use(
    config =>{
        console.log(`${config.method.toUpperCase()} request sent to ${config.url} at 
        ${new Date().getTime()}`);
        return config;
    }, 
    error => {
        return new Promise.reject(error);
    }
  )
  
  // AXIOS INSTANCES
  const axiosInstance = axios.create({
    //other custom settings
    baseURL:'https://jsonplaceholder.typicode.com'
  });

//   axiosInstance.get('/comments').then(res => showOutput(res));
  
  // Show output in browser
  function showOutput(res) {
    document.getElementById('res').innerHTML = `
    <div class="card card-body mb-4">
      <h5>Status: ${res.status}</h5>
    </div>
  
    <div class="card mt-3">
      <div class="card-header">
        Headers
      </div>
      <div class="card-body">
        <pre>${JSON.stringify(res.headers, null, 2)}</pre>
      </div>
    </div>
  
    <div class="card mt-3">
      <div class="card-header">
        Data
      </div>
      <div class="card-body">
        <pre>${JSON.stringify(res.data, null, 2)}</pre>
      </div>
    </div>
  
    <div class="card mt-3">
      <div class="card-header">
        Config
      </div>
      <div class="card-body">
        <pre>${JSON.stringify(res.config, null, 2)}</pre>
      </div>
    </div>
  `;
  }
  
  // Event listeners
  document.getElementById('get').addEventListener('click', getTodos);
  document.getElementById('post').addEventListener('click', addTodo);
  document.getElementById('update').addEventListener('click', updateTodo);
  document.getElementById('delete').addEventListener('click', removeTodo);
  document.getElementById('sim').addEventListener('click', getData);
  document.getElementById('headers').addEventListener('click', customHeaders);
  document
    .getElementById('transform')
    .addEventListener('click', transformResponse);
  document.getElementById('error').addEventListener('click', errorHandling);
  document.getElementById('cancel').addEventListener('click', cancelToken);