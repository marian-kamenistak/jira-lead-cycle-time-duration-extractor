import * as fs from 'fs';
import * as ProgressBar from 'progress';
import * as chalk from 'chalk';
import { safeLoad } from 'js-yaml';
import { argv } from 'yargs';
import { prompt } from 'inquirer';
import { JiraExtractor } from './index';
import { convertYamlToJiraSettings } from './src/components/yaml-converter';

const defaultYamlPath = 'config.yaml';
const defaultOutputPath = 'output.csv';

const bar = new ProgressBar(chalk.cyan('  Extracting: [:bar] :percent | :eta seconds remaining'), {
  complete: '=',
  incomplete: ' ',
  width: 20,
  total: 100,
});

const getArgs = () => argv;

const clearConsole = (): boolean => process.stdout.write('\x1Bc');

const writeFile = (filePath: string, data: any) =>
  new Promise<void>((accept, reject) => {
    fs.writeFile(filePath, data, (err => {
      if (err) {
        console.log(`Error writing file to ${filePath}`);
        return reject(err);
      }
      accept();
    }));
  });

const getPassword = async (): Promise<string> => {
  const passwordQuestion = {
    message: 'Enter your JIRA password: ',
    type: 'password',
    name: 'password'
  };
  const answers = await prompt(passwordQuestion);
  const password: string = answers['password'];
  return password;
};

const run = async function (cliArgs: any): Promise<void> {
  clearConsole();
  console.log(chalk.underline('Jira data extractor tool'));
  console.log('JIRA Extractor configuring...');
  // Parse CLI settings
  const jiraConfigPath: string = cliArgs.i ? cliArgs.i : defaultYamlPath;
  const debugMode: boolean = cliArgs.d ? true : false;
  const outputPath: string = cliArgs.o ? cliArgs.o : defaultOutputPath;
  const cliUsername: string = cliArgs.u;
  const cliPassword: string = cliArgs.p;

  // Parse YAML settings
  let settings: any = {};
  try {
    let yamlConfig = safeLoad(fs.readFileSync(jiraConfigPath, 'utf8'));
    settings = yamlConfig;
  } catch (e) {
    console.log(`Error parsing settings ${e}`);
    throw e;
  }

  if (cliUsername) {
    settings.Connection.Username = cliUsername;
  }
  if (cliPassword) {
    settings.Connection.Password = cliPassword;
  }

  console.log('');
  if (debugMode) {
    console.log(`Debug mode: ${chalk.green('ON') }`);
  }

  if (!settings.Connection.Password && !settings.Connection.Token) {
    const password = await getPassword();
    settings.Connection.Password = password;
    console.log('');
  }

  // Import data
  const jiraExtractorConfig = convertYamlToJiraSettings(settings);
  const jiraExtractor = new JiraExtractor(jiraExtractorConfig);

  console.log('Beginning extraction process');
  // Progress bar setup
  const updateProgressHook = (bar => {
    bar.tick();
    return (percentDone: number) => {
      if (percentDone <= 100) {
        bar.tick(percentDone);
      }
    };
  })(bar);

  try {
    const workItems = await jiraExtractor.extractAll(updateProgressHook, debugMode);
    // Export data
    let data: string = '';
    data = await jiraExtractor.toCSV(workItems);
    try {
      await writeFile(outputPath, data);
    } catch (e) {
      console.log(`Error writing jira data to ${outputPath}`);
    }
    console.log(chalk.green('Successful.'));
    console.log(`Results written to ${outputPath}`);
    return;
  } catch (e) {
    throw e;
  }
};

(async function (args: any): Promise<void> {
  try {
    await run(args);
  } catch (e) {
    console.log('');
    console.log(chalk.red(e));
  }
} (getArgs()));



