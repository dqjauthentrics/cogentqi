<?php

namespace App\Presenters;

use Nette,
	App\Model,
	Nette\Application\UI\Presenter,
	ResourcesModule\BasePresenter,
	Nette\Application\Responses\ForwardResponse,
	Nette\Application\Responses\CallbackResponse,
	App\Components\DbContext,
	Tracy\ILogger;


class ErrorPresenter extends Presenter {
	/** @var ILogger */
	private $logger;

	/**
	 * @param \Tracy\ILogger $logger
	 */
	public function __construct(ILogger $logger) {
		$this->logger = $logger;
		parent::__construct($logger);
	}

	/**
	 * @param  Exception
	 *
	 * @return void
	 */
	public function renderDefault($exception) {
		if ($exception instanceof Nette\Application\BadRequestException) {
			$code = $exception->getCode();
			// load template 403.latte or 404.latte or ... 4xx.latte
			$this->setView(in_array($code, [403, 404, 405, 410, 500]) ? $code : '4xx');
			// log to access.log
			$this->logger->log("HTTP code $code: {$exception->getMessage()} in {$exception->getFile()}:{$exception->getLine()}", 'access');
		}
		else {
			$this->setView('500'); // load template 500.latte
			$this->logger->log($exception, ILogger::EXCEPTION); // and log exception
		}
		if ($this->isAjax()) { // AJAX request? Note this error in payload.
			$this->payload->error = TRUE;
			$this->terminate();
		}
	}

	/**
	 * @param \Nette\Application\Request $request
	 *
	 * @return \Nette\Application\Responses\CallbackResponse|\Nette\Application\Responses\ForwardResponse
	 */
	public function run(Nette\Application\Request $request) {
		$exception = $request->getParameter('exception');
		if ($exception instanceof Nette\Application\BadRequestException) {
			return new ForwardResponse($request->setPresenterName('Error4xx'));
		}
		$this->logger->log($exception, ILogger::EXCEPTION);
		if ($this->isAjax()) {
			$this->sendJson(["error" => $exception->getMessage(), "code" => $exception->getCode(), "type" => $exception->getClass()]);
			exit();
    	}
		return new CallbackResponse(function () {
			require __DIR__ . "/templates/Error/500.latte";
		});
	}

}
