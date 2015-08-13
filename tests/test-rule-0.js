var system = require('system');
var args = system.args;
var ab = args[3];
var myid = ab.split('.')[0].split('-')[2];
console.log("ab: "+ab);
console.log("myid: "+myid);
var testid = myid, testname = casper.cli.get("testname") + testid;
casper.test.begin(testname, 2, function suite(test) {
    casper.start(casper.cli.get("url") + '/' + casper.cli.get("page"), function() {
        var file = '.\\' + casper.cli.get("testdata") + '\\' + testname + '.rdf';
        this.page.uploadFile('input[type="file"]', file);
        this.sendKeys('input#endpoint', casper.cli.get("url") + '/' + casper.cli.get("endpoint"), {reset: true});
        if (casper.cli.has("output")) {this.capture(casper.cli.get("output") + '/' + testname + '-0.png'); }
        this.click('button[id="validate"]');
    });

    casper.then(function() {
        this.waitForResource(this.getCurrentUrl(), function() {
            if (casper.cli.has("output")) {this.capture(casper.cli.get("output") + '/' + testname + '-1.png'); }
            var xml = this.page.content, parser, xmlDoc, results, binding;
            //this.echo(xml);
            parser = new DOMParser();
            xmlDoc = parser.parseFromString(xml, 'text/xml');
            results = xmlDoc.getElementsByTagName("results")[0].childNodes;
            test.assertEquals(results.length, 3);
            binding = xmlDoc.getElementsByTagName("binding")[1].textContent.trim();
            //this.echo(binding);
            test.assertEquals(binding, testid);
        }, 5000);
    });

    casper.run(function() {
        test.done();
    });
});