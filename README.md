# dcat-ap_validator

This software performs the validation of <a href="https://joinup.ec.europa.eu/asset/dcat_application_profile/description">DCAT-AP</a> rdf files.
Validation is performed via a web form which loads a rdf/xml file as graph in a triplestore and it queries the triple store with a SPARQL query. The validator is located in the <b>pages</b> folder.

The SPARQL query contains several rules which are based on those available here (1st source):
https://github.com/nvdk/OpenDataSupport/tree/master/odip.opendatasupport.eu/validation_queries

And they should be verified with (2nd source):
https://github.com/tenforce/ods-lodms-plugins/blob/master/lodms-ods-transformers/ods-validator/src/main/resources/com/tenforce/lodms/transformers/default_rules.xml

All the rules are stored in the <b>rules</b> folder. For almost each rule a test and a test data have been created. Tests are located in <b>tests</b> folder and they are Javascript files, test data are located in <b>tests-data</b> folder and they are xml/rdf files to be tested against.

All the tools used for the development of the validator are stored in the <b>tools</b> folder.

<h2>Structure of the validator</h2>
The validator is based on the dcat-ap_validator.html file which includes the dcat-ap_validator.js file responsible for loading the SPARQL query (dcat-ap.rq) and contacting the triplestore (<a href="http://jena.apache.org/documentation/serving_data/">Fuseki</a>).
If the result of the query is in XML format there is an XSLT stylesheet applied (xml-to-html-dcat-ap.xsl)

<h2>Structure of a rule</h2>
Each rule is indicated with a progressive id number (starting from 0) and stored in a file named with the convention:

<code>rule-id.rq</code>

Therefore, for example, the rule 0 is stored in the file rule-0.rq.

Each rule is a SPARQL query which has been documented with <a href="https://github.com/ldodds/sparql-doc">sparql-doc</a> annotations and validated with the <a href="http://www.sparql.org/query-validator.html">online sparql validator</a>.

When a rule is validated it is added to the dcat-ap.rq file (locates inside the pages folder) which is then loaded into the the web form via the dcat-ap_validator.js file.

<h2>Structure of a test data</h2>
Each test data is directly connected to the rule id number and stored in a file named with the convention:

<code>test-rule-id.rdf</code>

Therefore, for example, the test data related to the rule 0 is stored in the file test-rule-0.rdf
Not all the test data are implemented, for example literals are not tested.

<h2>Structure of a test</h2>
A test exists only if the test-data has been created. A test file follows the name convention:

<code>test-rule-id.js</code>

Therefore, for example, the test which will validate again the test-rule-0.rdf will be called simply test-rule-0.js
This is important because each test uses the rule number to open the related test data file.

<h2>Installation instructions</h2>
<ol>
<li>The validator uses Fuseki 1 as triple store which you can download from the <b>tools</b> directory (jena-fuseki1-1.1.2-distribution.zip) or from an <a href="http://www.apache.org/dist/jena/">Apache mirror site</a>.</li>
<li>Unpack the binary distribution to your a <code>FUSEKI_HOME</code> folder of your choice.</li>
<li>Copy the content of the <b>pages</b> folder under the <code>FUSEKI_HOME</code> folder. Keep the folder structure in tact. Verify that the file 'dcat-ap_validator_validator.html' is in the <code>FUSEKI_HOME/pages</code> folder.</li>
<li>Fuseki requires a <a href="http://www.oracle.com/technetwork/java/javase/downloads/java-se-jre-7-download-432155.html">Java Runtime Environment</a> to be installed on your machine</li>
</ol>

<h2>User guide</h2>
<ol>
<li>Launch Fuseki using the command in 'dcat-ap_validator_launchfuseki.cmd':

<code>java -jar fuseki-server.jar --update --port=3030 --mem /dcat-ap_validator</code>
</li>
<li>Direct your browser to <a href="http://localhost:3030/dcat-ap_validator.html">http://localhost:3030/dcat-ap_validator.html</a></li>
<li>You get this page from Fuseki's internal web server.</li>
<li>Select one or more RDF files that contain the software metadata to validate. Optionally, also controlled vocabularies can be incldued to verify correct usage of them.</li>
<li>Optionally, you can set another SPARQL endpoint, output format, or even modify the SPARQL validation query. </li>
<li>Hit the 'Validate' button. Fuseki returns the validation results within seconds.</li>
</ol>
<h2>Development</h2>
The development process is based on:
<ol>
<li><a href="http://ant.apache.org/">Ant</a> 1.9.6, which executes the build.xml to automate all the development process</li>
<li><a href="https://github.com/ldodds/sparql-doc">sparql-doc</a> 0.0.4 which generates HTML documentation based on rules (SPARQL queries). Sparql-doc is installed on Windows machine after <a href="http://railsinstaller.org/en">Railsinstaller</a> 2.2.5 for Ruby 1.9 (required by sparql-doc) with the command:<code>gem install sparql-doc</code></li>
<li><a href="https://code.google.com/p/jslint4java/">jslint4java</a> 2.0.5 which validates the javascript used by the validator accordingly to JSLint rules.</li>
<li><a href="https://jenkins-ci.org/">Jenkins</a> 1.6.2.1 to automate the launch of Ant, sparql-doc, Jslint and get the code from Github. Jenkins has been installed with:
<ol>
<li>the Github plugin, to download the code from GitHub</li>
<li>the Violation plugin, to monitor the JSLint errors in the dcat-ap_validator.js and in the tests files; the violation plugin reads the jslint.xml file located in the <b>jslint</b> folder which is generated by the jslint ant task.</li>
<li>the Xunit plugin, to monitor the result of the test execution; the Xunit plugin reads the xunit.xml file locatd in <b>test-execution</b> folder which is generated by casperjs ant task.</li>
</ol>
</li>
<li><a href="https://casperjs.org">casperjs</a> 1.1 beta to execute all the tests.</li> 
</ol>
<h2>TO DO</h2>
<table>
<tr><th>Action</th><th>Priority</th><th>Status</th></tr>
<tr><td>Check all the rules from the 1st source and verify with the 2nd source</td><td>High</td><td>9 rules missing for dataset, 18 for distribution, verification:0%</td></tr>
<tr><td>Improve quality of the tests: more asserts (test 11, 30), jsdoc, parametrize comments, categorization by node (dataset, agent, etc.)</td><td>Medium</td><td>Not done</td></tr>
<tr><td>Homogenize css between build.css, dcat-ap_validator.html css and results css</td><td>Low</td><td>Not done</td></tr>
<tr><td>Improve form web interface (like W3C validator)</td><td>Low</td><td>Not done</td></tr>
<tr><td>Improve results web interface (datatable), implies better result data (rules and tests)</td><td>Low</td><td>Not done</td></tr>
<tr><td>Add jsdoc and jsmin to the development process</td><td>Low</td><td>Not done</td></tr>
</table>
