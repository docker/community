<a id="top"></a>
<img src="https://raw.githubusercontent.com/docker/community/master/Docker-Birthday-3/tutorial-images/logo.png" alt="docker logo">

*Learn to build and deploy your distributed applications easily to the cloud with Docker*

<a href="#top" class="top" id="getting-started">Top</a>
## Getting Started: FAQs

### What is Docker?
Wikipedia defines [Docker](https://www.docker.com/) as

> an open-source project that automates the deployment of software applications inside **containers** by providing an additional layer of abstraction and automation of **OS-level virtualization** on Linux.

In simpler words, Docker is a tool that allows developers, sys-admins etc. to easily deploy their applications in a sandbox (called *containers*) to run on the host operating system i.e. Linux. The key benefit of Docker is that it allows users to **package an application with all of its dependencies into a standardized unit** for software development. Unlike virtual machines, containers do not have the high overhead and hence enable more efficient usage of the underlying system and resources.


### What are containers?

The industry standard today is to use Virtual Machines (VMs) to run software applications. VMs run applications inside a guest Operating System, which runs on virtual hardware powered by the server’s host OS.

VMs are great at providing full process isolation for applications: there are very few ways a problem in the host operating system can affect the software running in the guest operating system, and vice-versa. But this isolation comes at great cost — the computational overhead spent virtualizing hardware for a guest OS to use is substantial.

Containers take a different approach: by leveraging the low-level mechanics of the host operating system, containers provide most of the isolation of virtual machines at a fraction of the computing power.

### What will this tutorial teach me?
This tutorial aims to be the one-stop shop for getting your hands dirty with Docker. Apart from demystifying the Docker landscape, it'll give you hands-on experience with building and deploying your own webapps. You'll quickly build a multi-container voting app using multiple languages. Even if you have no prior experience with deployments, this tutorial should be all you need to get started.

## Using this Document
This document contains a series of several sections, each of which explains a particular aspect of Docker. In each section, you will be typing commands (or writing code). All the code used in the tutorial is available in the [Github repo](https://github.com/docker/community/tree/master/Docker-Birthday-3).

<a href="#top" class="top" id="table-of-contents">Top</a>
## Table of Contents

-	[Preface](#preface)
    -	[Prerequisites](#prerequisites)
    -	[Setting up your computer](#setup)
-   [1.0 Playing with Busybox](#busybox)
    -   [1.1 Docker Run](#dockerrun)
    -   [1.2 Terminology](#terminology)
-   [2.0 Webapps with Docker](#webapps)
    -   [2.1 Static Sites](#static-site)
    -   [2.2 Docker Images](#docker-images)
    -   [2.3 Our First Image](#our-image)
    -   [2.4 Dockerfile](#dockerfiles)
    -   [2.5 Push image to Docker Hub](#pushimage)
    -   [2.6 Docker compose](#dockercompose)
-	 [3.0 Enter competition](#dockercompetition)
	- [3.1 Pull voting-app images](#pullimage)
	- [3.2 Instruction for building your voting app](#buildvotingapp)
		- [3.2.1 Modify app.py](#modifyapp)
		- [3.2.2 Modify config.json](#modifyconfig)
		- [3.2.3 Build and tag images](#buildandtag)
		- [3.2.4 Push images to Docker Hub](#pushimages)
	- [3.3 Enter competition](#entercompetition)
		- [3.3.1 Using the a web page published from container](#usingbutton)
		- [3.3.2 Using curl](#usingcurl)
	- [3.4 Check your submission status](#checkstatus)
-   [4.0 Wrap Up](#wrap-up)
-   [References](#references)


------------------------------
<a href="#table-of-contents" class="top" id="preface">Top</a>
## Preface

> Note: This tutorial uses version **1.10.1** of Docker. If you find any part of the tutorial incompatible with a future version, please raise an [issue](https://github.com/docker/community/issues). Thanks!

<a id="prerequisites"></a>
### Prerequisites
There are no specific skills needed for this tutorial beyond a basic comfort with the command line and using a text editor. Prior experience in developing web applications will be helpful but is not required. As you proceed further along the tutorial, we'll make use of Docker Hub, so please create an account on each of these websites:

- [Docker Hub](https://hub.docker.com/)

<a id="setup"></a>
### Setting up your computer
Getting all the tooling setup on your computer can be a daunting task, but thankfully as Docker has become stable, getting Docker up and running on your favorite OS has become very easy. First, we'll install Docker.

Docker has invested significantly into improving the on-boarding experience for its users on these OSes, thus running Docker now is a cakewalk. The *getting started* guide on Docker has detailed instructions for setting up Docker on [Mac](http://docs.docker.com/mac/step_one/), [Linux](http://docs.docker.com/linux/step_one/) and [Windows](http://docs.docker.com/windows/step_one/).

Once you are done installing Docker, test your Docker installation by running the following:
```
$ docker run hello-world

Hello from Docker.
This message shows that your installation appears to be working correctly.
...
```
<a href="#table-of-contents" class="top" id="preface">Top</a>
<a id="busybox"></a>
## 1.0 Playing with Busybox
Now that you have everything setup, it's time to get our hands dirty. In this section, you are going to run a [Busybox](https://en.wikipedia.org/wiki/BusyBox) container (a lightweight linux distribution) on our system and get a taste of the `docker run` command.

To get started, let's run the following in our terminal:
```
$ docker pull busybox
```

> Note: Depending on how you've installed docker on your system, you might see a `permission denied` error after running the above command. If you're on a Mac, make sure the Docker engine is running. If you're on Linux, then prefix your `docker` commands with `sudo`. Alternatively you can [create a docker group](http://docs.docker.com/engine/installation/ubuntulinux/#create-a-docker-group) to get rid of this issue.

The `pull` command fetches the busybox **image** from the **Docker registry** and saves it in our system. You can use the `docker images` command to see a list of all images on your system.
```
$ docker images
REPOSITORY              TAG                 IMAGE ID            CREATED             VIRTUAL SIZE
busybox                 latest              c51f86c28340        4 weeks ago         1.109 MB
```

<a id="dockerrun"></a>
### 1.1 Docker Run
Great! Let's now run a Docker **container** based on this image. To do that you are going to use the `docker run` command.

```
$ docker run busybox
$
```
Wait, nothing happened! Is that a bug? Well, no. Behind the scenes, a lot of stuff happened. When you call `run`, the Docker client finds the image (busybox in this case), loads up the container and then runs a command in that container. When you run `docker run busybox`, you didn't provide a command, so the container booted up, ran an empty command and then exited. Let's try something more exciting.

```
$ docker run busybox echo "hello from busybox"
hello from busybox
```
OK, that's some actual output. In this case, the Docker client dutifully ran the `echo` command in our busybox container and then exited it. If you've noticed, all of that happened pretty quickly. Imagine booting up a virtual machine, running a command and then killing it. Now you know why they say containers are fast! Ok, now it's time to see the `docker ps` command. The `docker ps` command shows you all containers that are currently running.

```
$ docker ps
CONTAINER ID        IMAGE               COMMAND             CREATED             STATUS              PORTS               NAMES
```
Since no containers are running, you see a blank line. Let's try a more useful variant: `docker ps -a`
```
$ docker ps -a
CONTAINER ID        IMAGE               COMMAND             CREATED             STATUS                      PORTS               NAMES
305297d7a235        busybox             "uptime"            11 minutes ago      Exited (0) 11 minutes ago                       distracted_goldstine
ff0a5c3750b9        busybox             "sh"                12 minutes ago      Exited (0) 12 minutes ago                       elated_ramanujan
```
So what you see above is a list of all containers that you ran. Do notice that the `STATUS` column shows that these containers exited a few minutes ago. You're probably wondering if there is a way to run more than just one command in a container. Let's try that now:
```
$ docker run -it busybox sh
/ # ls
bin   dev   etc   home  proc  root  sys   tmp   usr   var
/ # uptime
 05:45:21 up  5:58,  0 users,  load average: 0.00, 0.01, 0.04
```
Running the `run` command with the `-it` flags attaches us to an interactive tty in the container. Now you can run as many commands in the container as you want. Take some time to run your favorite commands.

> **Danger Zone**: If you're feeling particularly adventurous you can try `rm -rf bin` in the container. Make sure you run this command in the container and **not** in your laptop. Doing this will not make any other commands like `ls`, `echo` work. Once everything stops working, you can exit the container and then start it up again with the `docker run -it busybox sh` command. Since Docker creates a new container every time, everything should start working again.

That concludes a whirlwind tour of the `docker run` command which would most likely be the command you'll use most often. It makes sense to spend some time getting comfortable with it. To find out more about `run`, use `docker run --help` to see a list of all flags it supports. As you proceed further, we'll see a few more variants of `docker run`.

<a id="terminology"></a>
### 1.2 Terminology
In the last section, you used a lot of Docker-specific jargon which might be confusing to some. So before you go further, let me clarify some terminology that is used frequently in the Docker ecosystem.

- *Images* - The blueprints of our application which form the basis of containers. In the demo above, you used the `docker pull` command to download the **busybox** image.
- *Containers* - Created from Docker images and run the actual application. you create a container using `docker run` which you did using the busybox image that you downloaded. A list of running containers can be seen using the `docker ps` command.
- *Docker Daemon* - The background service running on the host that manages building, running and distributing Docker containers. The daemon is the process that runs in the operation system to which clients talk to.
- *Docker Client* - The command line tool that allows the user to interact with the daemon.
- *Docker Hub* - A [registry](https://hub.docker.com/explore/) of Docker images. You can think of the registry as a directory of all available Docker images. You'll be using this later in this tutorial.

<a href="#table-of-contents" class="top" id="preface">Top</a>
<a id="webapps"></a>
## 2.0 Webapps with Docker
Great! So you have now looked at `docker run`, played with a docker container and also got a hang of some terminology. Armed with all this knowledge, you are now ready to get to the real-stuff i.e. deploying web applications with docker.

<a id="static-site"></a>
### 2.1 Static Sites
Let's start by taking baby-steps. The first thing we're going to look at is how you can run a dead-simple static website. You're going to pull a docker image from the docker hub, running the container and see how easy it so to run a webserver.

Let's begin. The image that you are going to use is a single-page website that was already created for the purposes of this demo and hosted it on the [registry](https://hub.docker.com/r/seqvence/static-site/) - `seqvence/static-site`. you can download and run the image directly in one go using `docker run`.

```
$ docker run seqvence/static-site
```
Since the image doesn't exist locally, the client will first fetch the image from the registry and then run the image. If all goes well, you should see a greeting message with a short message (`This is being served from a docker container`) about the webserver  in your browser. Okay now that the server is running, how do see the website? What port is it running on? And more importantly, how do you access the container directly from our host machine?

Well in this case, the client is not exposing any ports so you need to re-run the `docker run` command to publish ports and pass your name to the container to customize the message displayed. While were at it, you should also find a way so that our terminal is not attached to the running container. So that you can happily close your terminal and keep the container running. This is called the **detached** mode.

```
$ docker run --name static-site -e AUTHOR=Your_Name -d -P seqvence/static-site
e61d12292d69556eabe2a44c16cbd54486b2527e2ce4f95438e504afb7b02810
```

In the above command, `-d` will detach our terminal, `-P` will publish all exposed ports to random ports and finally `--name` corresponds to a name you want to give. Now you can see the ports by running the `docker port` command

```
$ docker port static-site
443/tcp -> 0.0.0.0:32772
80/tcp -> 0.0.0.0:32773
```

If you're on Linux, you can open [http://localhost:32772](http://localhost:32772) in your browser. If you're on Windows or a Mac, you need to find the IP of the hostname.

```
$ docker-machine ip default
192.168.99.100
```
You can now open [http://192.168.99.100:32772](http://192.168.99.100:32772) to see your site live! You can also specify a custom port to which the client will forward connections to the container.

```
$ docker run --name static-site -e AUTHOR=Your_Name -d -p 8888:80 seqvence/static-site
```
<img src="https://raw.githubusercontent.com/docker/community/master/Docker-Birthday-3/tutorial-images/static.png" title="static">

I'm sure you agree that was super simple. To deploy this on a real server you would just need to install docker, and run the above docker command.

Now that you've seen how to run a webserver inside a docker image, you must be wondering - how do I create my own docker image? This is the question we'll be exploring in the next section.

<a id="docker-images"></a>
### 2.2 Docker Images

You've looked at images before but in this section we'll dive deeper into what docker images are and build our own image. And, we'll also use that image to run our application locally. Finally, you'll push some of your images to Docker Hub.

Docker images are the basis of containers. In the previous example, you **pulled** the *seqvence/static-site* image from the registry and asked the docker client to run a container **based** on that image. To see the list of images that are available locally, use the `docker images` command.

```
$ docker images
REPOSITORY             TAG                 IMAGE ID            CREATED             SIZE
seqvence/static-site   latest              92a386b6e686        2 hours ago        190.5 MB
nginx                  latest              af4b3d7d5401        3 hours ago        190.5 MB
python                 2.7                 1c32174fd534        14 hours ago        676.8 MB
postgres               9.4                 88d845ac7a88        14 hours ago        263.6 MB
containous/traefik     latest              27b4e0c6b2fd        4 days ago          20.75 MB
node                   0.10                42426a5cba5f        6 days ago          633.7 MB
redis                  latest              4f5f397d4b7c        7 days ago          177.5 MB
mongo                  latest              467eb21035a8        7 days ago          309.7 MB
alpine                 3.3                 70c557e50ed6        8 days ago          4.794 MB
java                   7                   21f6ce84e43c        8 days ago          587.7 MB
```

The above gives a list of images that I've pulled from the registry and the ones that I've created myself (we'll shortly see how). The `TAG` refers to a particular snapshot of the image and the `ID` is the corresponding unique identifier for that image.

For simplicity, you can think of an image akin to a git repository - images can be [committed](https://docs.docker.com/engine/reference/commandline/commit/) with changes and have multiple versions. When you provide a specific version number, the client defaults to `latest`. For example, you can pull a specific version of `ubuntu` image
```
$ docker pull ubuntu:12.04
```

To get a new Docker image you can either get it from a registry (such as the docker hub) or create your own. There are tens of thousands of images available on [Docker hub](https://hub.docker.com). You can also search for images directly from the command line using `docker search`.

An important distinction to be aware of when it comes to images is between base and child images.

- **Base images** are images that has no parent image, usually images with an OS like ubuntu, busybox or debian.

- **Child images** are images that build on base images and add additional functionality.

Then there are two more types of images that can be both base and child images, they are official and user images.

- **Official images** Docker, Inc. sponsors a dedicated team that is responsible for reviewing and publishing all Official Repositories content. This team works in collaboration with upstream software maintainers, security experts, and the broader Docker community. These are typically one word long. In the list of images above, the `python`, `node`, `alpine` and `nginx` images are base images. To find out more about them, check out the [Official Images Documentation](https://docs.docker.com/docker-hub/official_repos/).

- **User images** are images created and shared by users like you. They build on base images and add additional functionality. Typically these are formatted as `user/image-name`.

<a id="our-image"></a>
### 2.3 Our First Image

Now that you have a better understanding of images, it's time to create our own. Our goal in this section will be to create an image that sandboxes a simple [Flask](http://flask.pocoo.org) application. For the purposes of this workshop, I've already created a fun, little [Flask app](https://github.com/docker/community/master/Docker-Birthday-3/flask-app) that displays a random cat `.gif` every time it is loaded - because you know, who doesn't like cats? If you haven't already, please go ahead the clone the repository locally.

<a id="dockerfiles"></a>
### 2.4 Dockerfile

A [Dockerfile](https://docs.docker.com/engine/reference/builder/) is a simple text-file that contains a list of commands that the docker client calls while creating an image. It is simple way to automate the image creation process. The best part is that the [commands](https://docs.docker.com/engine/reference/builder/#from) you write in a Dockerfile are *almost* identical to their equivalent Linux commands. This means you don't really have to learn new syntax to create your own dockerfiles.

**The goal of this exercise is to create a Docker image which will run a Flask app.**

Start by creating a folder ```flask-app``` where we'll create the following files:

```
- Dockerfile
- app.py
- requirements.txt
- templates/index.html
```

*The application directory does contain a Dockerfile but since we're doing this for the first time, we'll create one from scratch. To start, create a new blank file in our favorite text-editor and save it in the same folder as the flask app by the name of `Dockerfile`.*

Create the **app.py** with the following content:

```
from flask import Flask, render_template
import random

app = Flask(__name__)

# list of cat images
images = [
    "http://ak-hdl.buzzfed.com/static/2013-10/enhanced/webdr05/15/9/anigif_enhanced-buzz-26388-1381844103-11.gif",
    "http://ak-hdl.buzzfed.com/static/2013-10/enhanced/webdr01/15/9/anigif_enhanced-buzz-31540-1381844535-8.gif",
    "http://ak-hdl.buzzfed.com/static/2013-10/enhanced/webdr05/15/9/anigif_enhanced-buzz-26390-1381844163-18.gif",
    "http://ak-hdl.buzzfed.com/static/2013-10/enhanced/webdr06/15/10/anigif_enhanced-buzz-1376-1381846217-0.gif",
    "http://ak-hdl.buzzfed.com/static/2013-10/enhanced/webdr03/15/9/anigif_enhanced-buzz-3391-1381844336-26.gif",
    "http://ak-hdl.buzzfed.com/static/2013-10/enhanced/webdr06/15/10/anigif_enhanced-buzz-29111-1381845968-0.gif",
    "http://ak-hdl.buzzfed.com/static/2013-10/enhanced/webdr03/15/9/anigif_enhanced-buzz-3409-1381844582-13.gif",
    "http://ak-hdl.buzzfed.com/static/2013-10/enhanced/webdr02/15/9/anigif_enhanced-buzz-19667-1381844937-10.gif",
    "http://ak-hdl.buzzfed.com/static/2013-10/enhanced/webdr05/15/9/anigif_enhanced-buzz-26358-1381845043-13.gif",
    "http://ak-hdl.buzzfed.com/static/2013-10/enhanced/webdr06/15/9/anigif_enhanced-buzz-18774-1381844645-6.gif",
    "http://ak-hdl.buzzfed.com/static/2013-10/enhanced/webdr06/15/9/anigif_enhanced-buzz-25158-1381844793-0.gif",
    "http://ak-hdl.buzzfed.com/static/2013-10/enhanced/webdr03/15/10/anigif_enhanced-buzz-11980-1381846269-1.gif"
]

@app.route('/')
def index():
    url = random.choice(images)
    return render_template('index.html', url=url)

if __name__ == "__main__":
    app.run(host="0.0.0.0")
```

In order to install Python modules required for our app we need to add to **requirements.txt** file the following line:

```
Flask==0.10.1
```

Create directory template and edit there **index.html** file to have the same content as below:

```
<html>
  <head>
    <style type="text/css">
      body {
        background: black;
        color: white;
      }
      div.container {
        max-width: 500px;
        margin: 100px auto;
        border: 20px solid white;
        padding: 10px;
        text-align: center;
      }
      h4 {
        text-transform: uppercase;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <h4>Cat Gif of the day</h4>
      <img src="{{url}}" />
      <p><small>Courtesy: <a href="http://www.buzzfeed.com/copyranter/the-best-cat-gif-post-in-the-history-of-cat-gifs">Buzzfeed</a></small></p>
    </div>
  </body>
</html>
```

Before you get started on creating the image, let's first test that the application works correctly locally. Step one is to `cd` into the `flask-app` directory and install the dependencies

```
$ cd flask-app
$ pip install -r requirements.txt
$ python app.py
 * Running on http://0.0.0.0:5000/ (Press CTRL+C to quit)
```

If all goes well, you should see the output as above. Head over to [http://localhost:5000](http://localhost:5000) to see the app in action.

> Note: If `pip install` is giving you permission denied errors, you might need to try running the command as `sudo`.

Looks great doesn't it? The next step now is to create an image with this web app. As mentioned above, all user images are based off a base image. Since our application is written in Python, the base image we're going to use will be [Python 3](https://hub.docker.com/_/python/). More specifically, you are going to use the `python:3-onbuild` version of the python image.

What's the `onbuild` version you might ask?

> These images include multiple ONBUILD triggers, which should be all you need to bootstrap most applications. The build will COPY a `requirements.txt` file, RUN `pip install` on said file, and then copy the current directory into `/usr/src/app`.

In other words, the `onbuild` version of the image includes helpers that automate the boring parts of getting an app running. Rather than doing these tasks manually (or scripting these tasks), these images do that work for you. you now have all the ingredients to create our own image - a functioning web app and a base image. How are you going to do that? The answer is - using a **Dockerfile**.


Having all the pieces created it is now time to create the **Dockerfile**.

You start by specifying our base image. Use the `FROM` keyword to do that

```
FROM alpine:latest
```

The next step usually is to write the commands of copying the files and installing the dependencies. Create a directory for the app using [RUN](https://docs.docker.com/engine/reference/builder/#run) command:

```
RUN mkdir -p /usr/src/app/templates
```

The command above will create both directories: ```/usr/src/app``` and ```/usr/src/app/templates```.

Copy the files you have created earlier our image by using [COPY](https://docs.docker.com/engine/reference/builder/#copy)  command.

```
COPY app.py /usr/src/app/
COPY requirements.txt /usr/src/app/
COPY templates/index.html /usr/src/app/templates
```

Install all Python requirements for our app to run. This will be accomplished by adding the line:

```
RUN pip install --no-cache-dir -r /usr/src/app/requirements.txt
```

The next thing, you need to the tell is the port number which needs to be exposed. Since our flask app is running on `5000` that's what we'll indicate.
```
EXPOSE 5000
```
The last step is simply to write the command for running the application which is simply - `python ./app.py`. you use the [CMD](https://docs.docker.com/engine/reference/builder/#cmd) command to do that -

```
CMD ["python", "./app.py"]
```

The primary purpose of `CMD` is to tell the container which command it should run when it is started. With that, our `Dockerfile` is now ready. This is how it looks like -

```
# our base image
FROM alpine:latest

# Install python and pip
RUN apk add --update py-pip

# Create app directory
RUN mkdir -p /usr/src/app/templates

# copy files required for the app to run
COPY app.py /usr/src/app/
COPY requirements.txt /usr/src/app/
COPY templates/index.html /usr/src/app/templates

# install Python modules
RUN pip install --no-cache-dir -r /usr/src/app/requirements.txt

# tell the port number the container should expose
EXPOSE 5000

# run the application
CMD ["python", "/usr/src/app/app.py"]
```


Now that you finally have our `Dockerfile`, you can now build our image. The `docker build` command does the heavy-lifting of creating a docker image from a `Dockerfile`.

Let's run the following:

```
$ docker build -t YOUR_USERNAME/myfirstapp .
Sending build context to Docker daemon 7.168 kB
Step 1 : FROM alpine:latest
 ---> 90239124c352
Step 2 : RUN apk add --update py-pip
 ---> Running in eccbd4f10adc
fetch http://dl-4.alpinelinux.org/alpine/v3.3/main/x86_64/APKINDEX.tar.gz
fetch http://dl-4.alpinelinux.org/alpine/v3.3/community/x86_64/APKINDEX.tar.gz
(1/12) Installing libbz2 (1.0.6-r4)
(2/12) Installing expat (2.1.0-r2)
(3/12) Installing libffi (3.2.1-r2)
(4/12) Installing gdbm (1.11-r1)
(5/12) Installing ncurses-terminfo-base (6.0-r6)
(6/12) Installing ncurses-terminfo (6.0-r6)
(7/12) Installing ncurses-libs (6.0-r6)
(8/12) Installing readline (6.3.008-r4)
(9/12) Installing sqlite-libs (3.9.2-r0)
(10/12) Installing python (2.7.11-r3)
(11/12) Installing py-setuptools (18.8-r0)
(12/12) Installing py-pip (7.1.2-r0)
Executing busybox-1.24.1-r7.trigger
OK: 59 MiB in 23 packages
 ---> cfb2d28dcca6
Removing intermediate container eccbd4f10adc
Step 3 : COPY app.py /usr/src/app/
 ---> 1209708f9a6d
Removing intermediate container 26574093eaa5
Step 4 : EXPOSE 5000
 ---> Running in 69397414df70
 ---> d4839bccb1cb
Removing intermediate container 69397414df70
Step 5 : CMD python ./app.py
 ---> Running in 20168af7b1dd
 ---> beedea106164
Removing intermediate container 20168af7b1dd
Successfully built beedea106164
```
While running the command yourself, make sure to replace YOUR_USERNAME  with your username. This username should be the same on you created when you registered on [Docker hub](https://hub.docker.com). If you haven't done that yet, please go ahead and create an account. The `docker build` command is quite simple - it takes an optional tag name with `-t` and a location of the directory containing the `Dockerfile`.

If you don't have the `alpine:latest` image, the client will first pull the image and then create your image. Therefore, your output on running the command will look different from mine. Look carefully and you'll notice that the on-build triggers were executed correctly. If everything went well, your image should be ready! Run `docker images` and see if your image shows.

The last step in this section is to run the image and see if it actually works.

```
$ docker run -p 8888:5000 YOUR_USERNAME/myfirstapp
 * Running on http://0.0.0.0:5000/ (Press CTRL+C to quit)
```

Head over to the URL above and your app should be live.

<img src="https://raw.githubusercontent.com/docker/community/master/Docker-Birthday-3/tutorial-images/catgif.png" title="static">

Congratulations! You have successfully created your first docker image.

<a id="pushimage"></a>
### 2.5 Push image to [Docker hub](https://hub.docker.com)

Now that you have created your first Docker images is time to push it to [Docker hub](https://hub.docker.com). Assuming you have already created an account by now you need to login first using ```docker login```*:

```
$ docker login --username=YOUR_USERNAME --email=YOUR_EMAIL_ADDRESS
Password:
WARNING: login credentials saved in C:\Users\your_username\.docker\config.json
Login Succeeded
```

Pushing the image is achieved by running the following command*:

```
$ docker push YOUR_USERNAME/myfirstapp
The push refers to a repository [docker.io/YOUR_USERNAME/myfirstapp]
82ee1a5ef6e9: Pushed 
ecc18069267f: Pushed 
e0e4898a45e7: Pushed 
9698a0f385a6: Pushed 
acb71626a146: Pushed 
3f1ec2e56b6b: Pushed 
18efc99a87df: Pushed
```

\*Replace *YOUR_USERNAME* and *YOUR\_EMAIL\_ADDRESS* with your [Docker hub](https://hub.docker.com) username and your email address used during registration.

<a id="dockercompose"></a>
### 2.6 [Docker compose](https://docs.docker.com/compose/)

You know now how to build your own Docker image so let's take it to the next level and glue things together. For this assignment you have to run multiple containers and using Docker compose is the best way to achieve that. 

Start by quickly reading the documentation available [here](https://docs.docker.com/compose/overview/).

Once you are familiar with Docker compose install it using the [instructions](https://docs.docker.com/compose/install/).


<a id="dockercompetition"></a>
## 3 Docker birthday competition

<a id="pullimage"></a>
### 3.1 Pull voting-app images

Pull the voting-app repository already available at [Github Repo](https://github.com/docker/docker-birthday-3.git/example-voting-app).

```
git pull https://github.com/ManoMarks/example-voting-app.git
```

A Docker compose file is available for you to start the voting-app and get familiar with the containers and the app.

<a id="buildvotingapp"></a>
### 3.2 Instruction for building your voting app

Navigate to newly created directory (example-voting-app) and run start docker compose using docker-compose.yml.

```
$ docker-compose up -d
```

Once all containers are up you can check their status:

```
$ docker ps -a
CONTAINER ID        IMAGE                         COMMAND                  CREATED              STATUS              PORTS                     NAMES
f854dff5ce6d        examplevotingapp_result-app   "node server.js"         About a minute ago   Up About a minute   0.0.0.0:5001->80/tcp      examplevotingapp_result-app_1
4ff9f295f383        examplevotingapp_voting-app   "python app.py"          2 minutes ago        Up 2 minutes        0.0.0.0:5000->80/tcp      examplevotingapp_voting-app_1
fd1bf9d1b8c0        examplevotingapp_worker       "/usr/lib/jvm/java-7-"   3 minutes ago        Up 3 minutes                                  examplevotingapp_worker_1
32cd0d514f10        redis                         "/entrypoint.sh redis"   6 minutes ago        Up 6 minutes        0.0.0.0:32771->6379/tcp   examplevotingapp_redis_1
be5b0b21ab07        postgres:9.4                  "/docker-entrypoint.s"   6 minutes ago        Up 6 minutes        5432/tcp                  examplevotingapp_db_1
```

Browse around the containers to understand the structure and how the application is built.

Connect to a shell within the containers using the following command.


```
$ docker exec -t -i f854dff5ce6d bash
root@f854dff5ce6d:/#
```
<a id="modifyapp"></a>
#### 3.2.1 Modify app.py

In the folder ```example-voting-app/voting-app``` you need to edit the app.py and change the two options for the programming languages you chose. 

Edit the following lines:

```
option_a = os.getenv('OPTION_A', "One")
option_b = os.getenv('OPTION_B', "Two")
```

to look like:

```
option_a = os.getenv('OPTION_A', "Python")
option_b = os.getenv('OPTION_B', "Javascript")
```

Go ahead start the application, change the application files, rewrite Dockerfiles and Docker compose files. 

<a id="modifyconfig"></a>
#### 3.2.2 Modify config.json

Modifying the config.json is important when validating your submission to Docker Birthday Challenge. 
File is located in ```example-voting-app/result-app/views``` directory.

Its content looks now like:

```
{
  "name":"Gordon",
  "twitter":"@docker",
  "location":"San Francisco, CA, USA",
  "repo":["example/examplevotingapp_voting-app",\
  			"example/examplevotingapp_result-app"],
  "vote":"Cats"
}
```

and you need to replace it with your data:

```
{
  "name":"John Doe",
  "twitter":"@djohnd",
  "location":"San Francisco, CA, USA",
  "repo":["johnd/votingapp_voting-app", \
  			"johnd/votingapp_result-app"],
  "vote":"Python"
}
```
----

---
**Important:**
 
- You need to update the file with your data to be able to submit your entry in the competition.
- *repo* section should contain the name of the images as you tag them and upload them to Docker Hub ( more information at [3.2.5 Push images to Docker Hub](#pushimagestodockerhub) )
- *location* format is **City, Country**

---
---
<a id="buildandtag"></a>
#### 3.2.3 Build and tag images

However you decide to build your images using Docker files do not forget to test your application throughly.

###To check:

- File **config.json** must be available in one of the images you are going to build next. 
	- You need to make its content available via an HTTP call on port 80.
	- Example of the HTTP GET call:
	
	```
	$ curl http://container_id:80/getconfig
	{
	  "name":"John Doe",
	  "twitter":"@djohnd",
	  "location":"San Francisco, CA, USA",
	  "repo":["johnd/votingapp_voting-app", \
	  			"johnd/votingapp_result-app"],
	  "vote":"Python"
	}
	``` 
- Your containers have an ENTRYPOINT or COMMAND so that when started with the command ```docker run -d image_name ``` they will not exit immediately.

You are all set then. Navigate to each of the directories where you have a Dockerfile to build and tag your images that you want to submit.

In order to build the images, make sure to replace your *Docker Hub username* and *Docker image name* in the following commands:

```
$ docker build --no-cache -t johnd/votingapp_voting-app .
...
$ docker build --no-cache -t johnd/votingapp_result-app .
...
```

<a id="pushimages"></a>
#### 3.2.4 Push images to Docker Hub

Quickly, push the images to Docker hub using:

```
$ docker push johnd/votingapp_voting-app
...
$ docker push johnd/votingapp_result-app
...
```
 
<a id="entercompetition"></a>
### 3.3 Enter competition

There are two ways to submit your entry in the competition:

<a id="usingbutton"></a>
#### 3.3.1 Using the a web page published from examplevotingapp_result-app container

Double check once again the content of ```config.json file``` to make sure all the information is correct and start all containers from example voting app image **examplevotingapp_result-app**.


```
$ cd example-voting-app
$ docker-compose up -d 
```  

Get the *ID* of the running container running from image *examplevotingapp_result-app*:

```
$ docker ps -a | grep votingapp_result-app
5d92bc17124e        examplevotingapp_result-app   "node server.js"    3 minutes ago       Up 3 minutes        192.168.64.2:5001->80/tcp   compassionate_golick
```

Access the log files for the container **5d92bc17124e** using the following command:

```
$ docker logs -f 5d92bc17124e
Thu, 10 Mar 2016 21:48:15 GMT body-parser deprecated bodyParser: use individual json/urlencoded middlewares at server.js:77:9
Thu, 10 Mar 2016 21:48:16 GMT body-parser deprecated undefined extended: provide extended option at node_modules/body-parser/index.js:105:29
App running on port 80
Connected to db
```

Obtain the ip address of your docker machine

```
$ docker-machine ip default
192.168.64.2
```

Open a browser and access [http://192.168.64.2:5001/birthday.html](http://192.168.64.2:5001/birthday.html)

The page displayed will look like the one below:


<img src="https://raw.githubusercontent.com/docker/community/master/Docker-Birthday-3/tutorial-images/submit_work.png" title="static">

Button message is more than intuitive so go ahead and press it. 

Soon as you did you need to return to your docker container where you are watching the log files and the output should look like:

```
Thu, 10 Mar 2016 21:48:15 GMT body-parser deprecated bodyParser: use individual json/urlencoded middlewares at server.js:77:9
Thu, 10 Mar 2016 21:48:16 GMT body-parser deprecated undefined extended: provide extended option at node_modules/body-parser/index.js:105:29
App running on port 80
Connected to db
http://dockerize.it/competition/56e0d42b9be64d0016050302
```

<a id="usingcurl"></a>
#### 3.3.2 Using ```curl```


Another way of submitting work in the competition is by making use of ```curl``` command and you need to run an API call as described below:

```
$ curl -H "Content-type: application/json" \
	-X POST -d @config.json \
	http://dockerize.it/competition
	
{"response": "http://dockerize.it/competition/56df6ea39be64d001328870e"}
```
The API will return a link where you can check the status of your submission.

<a id="checkstatus"></a>
### 3.4 Check your submission status

You can check your submission by accessing the link returned when you submitted your work:

	http://dockerize.it/competition/56e0d42b9be64d0016050302


<a id="wrap-up"></a>
## 4.0 Wrap Up
And that's a wrap! After a long, exhaustive but fun tutorial you are now ready to take the container world by storm! If you followed along till the very end then you should definitely be proud of yourself. You learned how to setup docker, run your own containers, and use Docker Compose to create a multi-container application.

<a id="next-steps"></a>
### 4.1 Next Steps

<a href="#table-of-contents" class="top" id="preface">Top</a>
<a id="references"></a>
## References
- [What is docker](https://www.docker.com/what-docker)
- [Docker Compose](https://docs.docker.com/compose)
