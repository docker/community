
- Initial load of all the Docker-related meetups, members, events and RSVPs (API calls to populate the Neo4J graph database.) to identify overalaping group members for each city

- Get a refreshed list of the same data for upcoming meetups

- load RSVPs for each event to build a predictive model to tell us which members are still active specific meetups. I may have signed up for a meetup and gone only once, which means attending the Docker SF meetup wouldn't be a scheduling conflict moving forward. 

Import Neo4j__var_lib_neo4j_data_graph_db.png

Per the table above, 20% of the members of Docker San Francisco are also members of the Docker Online Meetup (which is to be expected), but 15% or more of your members are also members of the JavaScript Meetup, GoSF, CoreOS, and Devops meetups. I took a sample of these overlapping members for a few meetup groups and visualized them on the graph below:

Neo4j__var_lib_neo4j_data_graph_db.png

Screencast that outlines the API calls, data ingestion process, graph database and some of the findings here:

https://vimeo.com/spantree/review/141362314/36b5c26015
