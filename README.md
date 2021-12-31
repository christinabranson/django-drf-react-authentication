# Django / DRF / React Authentication Tutorial

## Intro

The goal of this tutorial is to set up a minimal Django app & a minimal React
app that are able to communicate via the Django Rest Framework API.

This app can serve as a template for future projects.

## Commit 1: Set up Django app & users

1. Start a new Django app:

    1. Create an empty project directory

    ```bash
    mkdir django-drf-react-authentication
    cd django-drf-react-authentication
    ```

    2. Assuming Django isn't installed already, install it & confirm:

    ```bash
    pip3 install Django
    python3 -m django --version
    ```

    3. Start up the Django project & confirm:

    ```bash
    django-admin startproject authdemo
    python3 authdemo/manage.py runserver
    ```

    Now we have an empty, minimal Django project.

    4. I usually set up my Django .gitignore up now, too, to prevent any 
    bad files from coming in. Googling `django gitignore` will give a lot of
    options.

2. (Optional but recommended) Modify the User model as needed.

    Modifying the User model can be difficult later on, so I like to sort out my needs,
    as best as I can, early on. Do we want to log in with `username` (the default) or
    the `email`? Do we have any required fields on the user? Do we forsee needing a user
    profile?

    For me, I almost always want `email` to be the field I use for logging in & I generally
    always want a user profile to add additional fields, even if it's empty at the beginning.

    1. Create a new auth-specific Django app from the `authdemo` directory:

        ```bash
        cd authdemo
        python3 manage.py startapp customauth
        ```

    2. Create & modify files as necessary.

        See `authdemo/customauth/models` for examples of a custom User & custom
        `UserProfile` model.

    3. Add the new `customauth` app to `authdemo/settings.py` and set the correct `AUTH_USER_MODEL` as needed.

3. Run migrations & check out users in the Django admin

    1. Run the migrations from the `authdemo` directory:

        ```bash
        python3 manage.py makemigrations
        python3 manage.py migrate
        ```

    2. Create a new super user account:

        ```bash
        python3 manage.py createsuperuser
        ```

    3. Start the development Django server and check out the admin:

        ```bash
        python3 manage.py runserver
        ```

        then navigate to http://127.0.0.1:8000/admin/

        If you add your User to the admin (see `customauth/admin.py` for an example), you'll
        be able to see the newly created user.

We now have a functionality Django app with users!

## Commit 2: Set up DRF with Token authentication

1. Install the necessary packages:

    ```bash
        pip3 install djangorestframework dj-rest-auth
    ```

    Django Rest Framework will be used throughout the application for providing token 
    authentication & serving our endpoints. DJ Rest Auth will help us out with authentication &
    token related endpoints.

2. Based on the documentation for each, we're going to install the applications, run migrations, and
    apply the correct settings.

    Add `rest_framework`, `rest_framework.authtoken`, and `dj_rest_auth` to our `settings.py`.

    Then run:

    ```bash
    python3 manage.py migrate
    ```

    We also want to set our Authentication method to `TokenAuthentication` and protect our endpoints
    with the following setting:

    ```python
    REST_FRAMEWORK = {
        'DEFAULT_AUTHENTICATION_CLASSES': (
            'rest_framework.authentication.TokenAuthentication',
        ),
        'DEFAULT_PERMISSION_CLASSES': [
            'rest_framework.permissions.IsAuthenticated',
        ]
    }
    ```

3. (Optional but recommended) Create a stub endpoint to test that our endpoints function & are locked behind tokens
    appropriately. See the changes to `authdemo/stub_view.py` and `authdemo/urls.py` to see this in action.

4. Confirm this functionality by using cURL to authenticate with the `/auth/login` endpoint.

    See `scripts/dj_rest_login.sh` for an example script that can be run to check that this works.
    The response to this script should be:
    ```bash
    $ ./dj_rest_login.sh 
    Email: INPUT_EMAIL
    Password:
    Logging in at: http://127.0.0.1:8000/auth/login/
    % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                    Dload  Upload   Total   Spent    Left  Speed
    100   120  100    50  100    70    251    352 --:--:-- --:--:-- --:--:--   353
    response: {"key":"VALID_RESPONSE_TOKEN"}
    ```

    You can also confirm the stub endpoint functionality. Try to access http://127.0.0.1:8000/stub/ in your
    browser. You should (correctly) get a 401 error because no credentials were included with the request.

    Now try this endpoint with cURL using `scripts/dj_rest_stub.sh`. When prompted,
    enter the `VALID_RESPONSE_TOKEN` from the response above:

    ```bash
    $ ./dj_rest_stub.sh 
    Access token: VALID_RESPONSE_TOKEN
    Accessing data at: http://127.0.0.1:8000/stub/ with token VALID_RESPONSE_TOKEN
    % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                    Dload  Upload   Total   Spent    Left  Speed
    100    50  100    50    0     0   5045      0 --:--:-- --:--:-- --:--:--  5555
    response: [{"name": "stub data 1"}, {"name": "stub data 2"}]
    ```

    Only with a valid token can we access the protected endpoint.

At this point, we have a functional API that includes a way to authenticate against the backend database
to retrieve an access token & a protected stub API endpoint to fetch data from.

Next, we will set up a React front end that will handle what right now we can only do with the command line.

## Commit 3: Create React app & set up basic authentication

We will now attempt to set up a functional, but trivial, React application capable of authenticating against
a Django backend & fetching JSON Data from the DRF-powered API. For our demo purposes, the React application will:

1. Provide a login form in order to authenticate against the `/auth/login` endpoint
2. On successful login, we will to do two things (in order):
    1. The Login component with set the `access_token` in local storage (that's within the browser) so that it can be attached to
request headers in the future
    2. The Stub component will try to reach out to the `stub` endpoint and populate that section of the UI with the data it gets back.
    This process will only work if the user has authenticated & a valid access_token exists in local storage.

From this point on, we're going to expect the Django web server is running.

1. Create a React app using:

    ```bash
    npx create-react-app demo_frontend
    ```

    and confirm its runs with:

    ```bash
    cd demo_frontend
    yarn start
    ```

    This should bring up the React logo at http://localhost:3000/

    From this point forward, its expected that we're working within the `demo_frontend`
    directory.

2. Install Axios and define a generic api-client.js function:

    ```bash
    yarn add axios
    ```

    See an example api-client in `demo_frontend/src/utils/api-client.js`

3. Implement a basic page to allow for authentication & access stub data. See the changes
    made in `demo_frontend/src/App.jsx`, `demo_frontend/src/components/Login.jsx`, and 
    `demo_frontend/src/components/Stub.jsx` for simplistic examples of authentication,
    managing user tokens, and data retrieval.

    Start the front end again with `yarn start` and attempt to login.

    **Tip**: if things aren't working as expected, make sure that Dev Tools is open and that you're paying attentions
    to the Console tab as well as the Network tab.

    At this point, you're likely seeing `CORS errors` in the Network tab when trying to authenticate.
    We will resolve this with the following.

4. Add CORS support to the Django backend.

    From the main directory, install [`django-cors-headers`](https://github.com/adamchainz/django-cors-headers) with:

    ```bash
    pip3 install django-cors-headers
    ```

    See the changes in `settings.py` to see a workable example for our use case. We will need to add:

    - `"corsheaders"` to our `INSTALLED_APPS`,
    - `"corsheaders.middleware.CorsMiddleware"` to our `MIDDLEWARE`
    - And the following two blocks to allow requests from our React app on port 3000:
        ```python
        CORS_ALLOWED_ORIGINS = [
            "http://localhost",
            "http://localhost:3000",
        ]
        CORS_ALLOW_CREDENTIALS = True
        ```

5. Try again to login and fetch data from the stub endpoint. We should now have a working React application
capable of authenticating against a Django backend & retrieving JSON data from an API.

## Next Steps

For the purposes of this tutorial, we're done. However there are a number of improvements that can be made here.

- The most important is the weak state management in the front end. Managing global state is a complicated problem and
there are many possible solutions. [React Context](https://reactjs.org/docs/context.html) is a common solution.
- Tests! The backend in particular has some functionality (user/user profile) & endpoint access in particular that are
suspiciously untested.