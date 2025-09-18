from flask import Blueprint, request, jsonify
from src.services.crewai_service import CrewAIService
import logging

crewai_bp = Blueprint('crewai', __name__)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@crewai_bp.route('/process', methods=['POST'])
def process_task():
    """
    Process a task using CrewAI agents with OpenAI integration
    """
    try:
        data = request.get_json()
        
        if not data or 'prompt' not in data:
            return jsonify({'error': 'Prompt is required'}), 400
        
        prompt = data['prompt']
        logger.info(f"Received prompt: {prompt}")
        
        # Initialize CrewAI service
        crewai_service = CrewAIService()
        
        # Process the task
        result = crewai_service.process_task(prompt)
        
        return jsonify({
            'success': True,
            'result': result
        })
        
    except Exception as e:
        logger.error(f"Error processing task: {str(e)}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@crewai_bp.route('/health', methods=['GET'])
def health_check():
    """
    Health check endpoint
    """
    return jsonify({
        'status': 'healthy',
        'service': 'CrewAI OpenAI Integration'
    })
