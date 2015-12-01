<?php
namespace Cogent\Plugins;

use Phalcon\Dispatcher;
use Phalcon\Events\Event;
use Phalcon\Mvc\Dispatcher as MvcDispatcher;
use Phalcon\Mvc\Dispatcher\Exception as DispatcherException;
use Phalcon\Mvc\User\Plugin;
use Cogent\Components\Result;

/**
 * NotFoundPlugin
 *
 * Handles not-found controller/actions
 */
class NotFoundPlugin extends Plugin {

	/**
	 * This action is executed before execute any action in the application.
	 *
	 * @param Event         $event
	 * @param MvcDispatcher $dispatcher
	 * @param \Exception    $exception
	 *
	 * @return boolean
	 */
	public function beforeException(Event $event, MvcDispatcher $dispatcher, \Exception $exception) {
		error_log($exception->getMessage() . PHP_EOL . $exception->getTraceAsString());
		$result = new Result();
		if ($exception instanceof DispatcherException) {
			switch ($exception->getCode()) {
				case Dispatcher::EXCEPTION_HANDLER_NOT_FOUND:
				case Dispatcher::EXCEPTION_ACTION_NOT_FOUND:
					$result->sendError(Result::CODE_NOT_FOUND);
					return FALSE;
			}
		}
		$result->sendError(Result::CODE_EXCEPTION);
		return FALSE;
	}
}
