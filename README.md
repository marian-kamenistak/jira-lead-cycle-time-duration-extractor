# README #

Production-ready. This is a tool designed to extract data from JIRA and convert it into Excel or CSV format. It automates the inclusion of essential data and **enhances it with flow status or stage start dates and durations with no further setting required**. Consequently, it enables easy calculation and visualization of **cycle time, lead time, and velocity**.


# Output
See an example of a generated output file in [examples/output.csv](https://github.com/marian-kamenistak/jira-data-extractor/blob/main/example/output%20example.csv).

![data](example/img/data%20table.png)


# Analytics
With obtained data, we can explore/analyse teams efficiency metrics
 - Lead time
 - Cycle time
 - Throughput
 - Velocity
 
in different visualization tools, such as Tableau, Looker, Power BI, etc.

### Cycle time drill-down
![histogram](example/img/cycle%20time.png)
### Cycle time histogram
![histogram](example/img/cycle%20time%20histogram.png)
### Roadmap balance
![histogram](example/img/roadmap%20balance.png)
### Investment allocation
![Investment](example/img/investment%20allocation.png)
### Quarterly Roadmap execution
![Roadmap](example/img/roadmap%20delivery.png)


***

# Configuration

Edit config.yaml file

The config file we use conforms to the YAML format standard (http://yaml.org/spec/) and is completely case sensitive. You can find an example config file here: [config.yaml](https://github.com/marian-kamenistak/jira-data-extractor/blob/main/config.yaml). Feel free to follow along with that example as we run through the details of each section of the file.


## Connection

    Connection:
        Domain: https://<subdomain>.atlassian.net/ Open Jira in your browser and see the domain.
        Username: <email>
        Password: <Jira API token> your Jira API Token can be generated at https://id.atlassian.com/manage-profile/security/api-tokens

### OAuth Support
OAuth is also supported. You must get the access token and access token secret on your own by completing the OAuth authorization.

    Connection:
        Domain: https://myjiradomain.com
        Consumer Key: applicationkey
        Private Key: 
        Token: 
        Token Secret: 

### Jira connection test
in your console, run:

    curl -v https://<subdomain>.atlassian.net/ --user <email>:<Jira API token>


## Jira issues selection
is driven by a JQL statement. Examples:

    JQL: 
        Query: created >= -30d order by created DESC
        Query: key=EPM-197
        Query: project in ("Team A", "Team B")
    
To create the right JQL query, open Jira -> Filter -> 'Advanced issue search' and build the query.


## Jira fields
The Attributes Section of the config file is simply named "Attributes" (without the quotes) and is another optional section that includes name-value pairs that you want included in your extracted data set. They may be Jira custom fields that are unique to your Jira instance, or certain standard Jira fields that we support. Each line in this section contains the name you want to appear as the attribute column name in the CSV file, followed by a colon, followed by the name of a Jira custom field or a supported standard field, like this:

Here are the standard Jira fields that you can use:

    Attributes:
          Stage: status.name      
          StatusCategory: status.statusCategory.name    
          Level: priority.name
          Labels: labels
          Components: components.name
          Version: fixVersions.last.name
          VersionRelease: fixVersions.last.releaseDate
          ParentId: parent.key
          ParentName: parent.fields.summary
          ParentType: parent.fields.issuetype.name

In order to add more of your custom parameters, see what other data fields an issue contains. You can use 

    curl --request GET \
      --url 'https://your-domain.atlassian.net/rest/api/3/issue/{issueIdOrKey}' \
      --user 'email@example.com:<api_token>' \
      --header 'Accept: application/json'


For more information about Jira fields and the structure, see Jira doc: Jira API doc: https://developer.atlassian.com/cloud/jira/platform/rest/v3/api-group-issue-fields/#api-group-issue-fields

***


# Install
1. Install git from https://git-scm.com/book/en/v2/Getting-Started-Installing-Git
2. Clone the project using git to your local device using command ```git clone https://github.com/ActionableAgile/jira-to-analytics.git```
3. install npm tool from https://nodejs.org/en/download
4. in the project folder, install all the dependent packages using command

    npm install

# Run the tool

    npm run build
    configure the config.yaml file for your connection
    npm run extact


## Run configuration parameters
These flags are the same whether you are using the standalone executable or node form of the extraction tool.

-i specifies input config file name (defaults to config.yaml)

-u specifies the username for the connection to Jira (by default the username in the config.yaml is used)

-p specifies the password for the connection to Jira (by default the password in the config.yaml is used)

To run the tool with parameters, use the following scheme:

    npm run extract -- --i SF/config.yaml
