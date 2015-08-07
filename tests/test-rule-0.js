casper.test.begin('test-rule-0', 2, function suite(test) {
	casper.start(casper.cli.get("url"), function() {
		this.page.uploadFile('input[type="file"]', '.\\tests-data\\test-rule-0.rdf');
		this.capture('test-execution/test-rule-0-0.png');
		this.click('button[id="validate"]');
		});

	casper.then(function() {
	  this.waitForResource(this.getCurrentUrl(),function() {
		this.capture('test-execution/test-rule-0-1.png');
		var xml = this.page.content;
		//this.echo(xml);
		parser = new DOMParser();
		xmlDoc = parser.parseFromString(xml,'text/xml');
		var results = xmlDoc.getElementsByTagName("results")[0].childNodes;
		test.assertEquals(results.length,3);
		var binding = xmlDoc.getElementsByTagName("binding")[1].textContent.trim();
		//this.echo(binding);
		test.assertEquals(binding,"0");
	  },function() {
		//page load failed after 5 seconds
	  },5000);
	});

casper.run(function() {
        test.done();
    });
});