<?php
/**
 * Created by PhpStorm.
 * User: Greg Emerson
 * Date: 11/20/15
 * Time: 10:42 AM
 */

namespace App\Presenters;

use ResourcesModule\BasePresenter,
    App\Model\Recommendation;

class RecommendationsPresenter extends BasePresenter {

    /**
     * @param int $id  an assessment id
     * @param int $mode
     */
    public function actionRead($id, $mode = self::MODE_LISTING) {
        $result = Recommendation::createRecommendationsForAssessment(
            $this->database, $id);
        $this->sendResult($result);
    }
}