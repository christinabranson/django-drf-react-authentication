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