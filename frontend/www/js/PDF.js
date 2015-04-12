'use strict';

angular.module('PDF', []).service('PDF', function ($filter, Utility) {
	var svc = this;

	svc.safeName = function (name) {
		return name.replace(/\W/g, '_');
	};

	svc.getBase64Image = function (url, assessment, generatePdf) {
		var img = new Image();
		var dataURL;
		img.src = url;
		img.onload = function () {
			var canvas = document.createElement('canvas');
			canvas.width = img.width;
			canvas.height = img.height;
			var context = canvas.getContext('2d');
			context.drawImage(img, 0, 0);
			dataURL = canvas.toDataURL('image/jpeg');
			generatePdf(assessment, dataURL);
		}
	};

	svc.getResponseColor = function (question) {
		if (question.rsp.typ == "NAYesNo") {
			if (question.rsp.ri == 2) {
				doc.setTextColor(0, 150, 0);
			}
			else if (question.rsp.ri == 1) {
				doc.setTextColor(150, 0, 0);
			}
		}
		else { // LIKERT5
			var rgb = null;
			switch (question.rsp.ri) {
				case 1:
					rgb = Utility.hexToRgb('#BB4444');
					break;
				case 2:
					rgb = Utility.hexToRgb('#EE7A00');
					break;
				case 3:
					rgb = Utility.hexToRgb('#FFD700');
					break;
				case 4:
					rgb = Utility.hexToRgb('#6A8');
					break;
				case 5:
					rgb = Utility.hexToRgb('#008000');
					break;
			}

		}
		return rgb;
	};

	svc.generateAssessmentDoc = function (assessment, imageData) {
		var doc = new jsPDF();
		doc.text(15, 20, assessment.instrument.nm);
		doc.addImage(imageData, 'JPEG', 165, 10, 40, 18);
		doc.setFontSize(12);
		doc.setTextColor(100, 100, 100);
		doc.text(120, 20, $filter('date')(assessment.lm, 'medium'));
		doc.setFontSize(16);
		doc.setTextColor(0, 0, 0);
		doc.text(15, 28, assessment.member.fn + ' ' + assessment.member.ln);
		var sectionY = 36;
		var questionY = 26;
		//var html = '<table><thead><tr><th>Col1</th><th>Col2</th><th>Col3</th></tr></thead><tbody>';
		for (var i = 0; i < assessment.instrument.sections.length; i++) {
			sectionY = questionY + 14;
			if (sectionY > 250) {
				doc.addPage();
				questionY = 20;
				sectionY = questionY;
			}
			var section = assessment.instrument.sections[i];
			doc.setFontSize(12);
			doc.setTextColor(50, 100, 150);
			doc.text(15, sectionY, section.name);
			//html += '<tr><th colspan="3">' + section.name + '</th></tr>';
			var splitHeight = 0;
			questionY = sectionY + 5;
			for (var j = 0; j < section.questions.length; j++) {
				var question = section.questions[j];
				questionY += splitHeight;
				if (questionY > 250) {
					doc.addPage();
					questionY = 20;
					sectionY = questionY;
				}
				doc.setFontSize(10);
				doc.setTextColor(100, 100, 100);
				var splitText = doc.splitTextToSize(question.nm, 140);
				splitHeight = 6;
				doc.text(20, questionY, splitText);
				if (question.rsp.typ == "NAYesNo") {
					splitHeight = Math.round(question.nm.length / 54) * 6;
				}
				var rgb = svc.getResponseColor(question);
				if (rgb !== null) {
					doc.setTextColor(rgb.r, rgb.g, rgb.b);
				}
				doc.text(164, questionY, question.rsp.r);
				//html += '<tr><td>&nbsp;</td><td>' + question.name + '</td><td>' + question.rsp.r + '</td></tr>';
			}
			//html += '</tbody></table>';
		}
		//doc.fromHTML(html, 20, 20, {});
		var assessmentFileName = 'Assessment_' + assessment.member.fn + '_' + assessment.member.ln + '_' + $filter('date')(assessment.lm, 'medium');
		assessmentFileName = svc.safeName(assessmentFileName);
		doc.save(assessmentFileName);
		//doc.output('dataurlnewwindow');
	};

	svc.assessment = function (assessment) {
		svc.getBase64Image('http://target.cogentqi/js/config/target/target-logo.jpg', assessment, svc.generateAssessmentDoc);
	};
});
