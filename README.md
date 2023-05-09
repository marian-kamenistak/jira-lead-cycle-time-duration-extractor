# README #

## Output
see ```example/output example.csv``` file to see an example of a generated output file

## Configuration: edit your config.yaml file:
### Connection
- domain: your Jira domain host. Open Jira in your browser and see the domain.
- user: your email
- password: your Jira API Token generated at https://id.atlassian.com/manage-profile/security/api-tokens
### Jira fields

## Jira states
All the Jira states are extracted autmatically with no further setting.


## Jira access test
in your console, run:
```curl -v https://<subdomain>.atlassian.net/ --user <email>:<Jira API token>```

## Install
1. download the project using git
2. install npm
2. in the project folder, execute
```npm install```


## Run
```npm run build```
```npm run extactor```

## Additional
Jira API doc: https://developer.atlassian.com/cloud/jira/platform/rest/v3/api-group-issue-fields/#api-group-issue-fields

