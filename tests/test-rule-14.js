var testid = "14", testname = "test-rule-" + testid;
casper.test.begin(testname, 2, function suite(test) {
    casper.start(casper.cli.get("url"), function() {
        var file = '.\\' + casper.cli.get("testdata") + '\\' + testname + '.rdf';
        this.page.uploadFile('input[type="file"]', file);
        this.capture(casper.cli.get("output") + '/' + testname + '-0.png');
        this.click('button[id="validate"]');
    });

    casper.then(function() {
        this.waitForResource(this.getCurrentUrl(), function() {
            this.capture(casper.cli.get("output") + '/' + testname + '-1.png');
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