import os
from crewai import Agent, Task, Crew, LLM
from dotenv import load_dotenv
import logging

# Load environment variables
load_dotenv()

logger = logging.getLogger(__name__)

class CrewAIService:
    def __init__(self):
        """
        Initialize the CrewAI service with OpenAI configuration
        """
        # Configure OpenAI LLM
        self.llm = LLM(
            model="gpt-4o-mini",
            api_key=os.getenv("OPENAI_API_KEY")
        )
        
        # Initialize agents
        self.researcher_agent = Agent(
            role='Research Specialist',
            goal='Conduct thorough research and gather comprehensive information on given topics',
            backstory="""You are an expert researcher with years of experience in gathering, 
            analyzing, and synthesizing information from various sources. You have a keen eye 
            for detail and can quickly identify the most relevant and reliable information.""",
            llm=self.llm,
            verbose=True
        )
        
        self.writer_agent = Agent(
            role='Content Writer',
            goal='Create engaging, well-structured, and informative content based on research findings',
            backstory="""You are a skilled content writer with expertise in transforming 
            complex research into clear, engaging, and accessible content. You have a talent 
            for storytelling and can adapt your writing style to different audiences.""",
            llm=self.llm,
            verbose=True
        )
        
        self.analyst_agent = Agent(
            role='Data Analyst',
            goal='Analyze information, identify patterns, and provide insights and recommendations',
            backstory="""You are a data analyst with strong analytical skills and experience 
            in interpreting complex information. You excel at finding patterns, drawing 
            conclusions, and providing actionable insights.""",
            llm=self.llm,
            verbose=True
        )
    
    def process_task(self, prompt):
        """
        Process a user prompt using CrewAI agents
        
        Args:
            prompt (str): User input prompt
            
        Returns:
            str: Processed result from the crew
        """
        try:
            # Create tasks based on the prompt
            research_task = Task(
                description=f"""Research the following topic thoroughly: {prompt}
                
                Gather comprehensive information including:
                - Key concepts and definitions
                - Current trends and developments
                - Important facts and statistics
                - Relevant examples or case studies
                
                Provide a detailed research summary.""",
                agent=self.researcher_agent,
                expected_output="A comprehensive research summary with key findings and relevant information"
            )
            
            analysis_task = Task(
                description=f"""Analyze the research findings from the previous task about: {prompt}
                
                Provide:
                - Key insights and patterns
                - Important implications
                - Potential opportunities or challenges
                - Recommendations or next steps
                
                Base your analysis on the research provided.""",
                agent=self.analyst_agent,
                expected_output="A detailed analysis with insights, implications, and recommendations",
                context=[research_task]
            )
            
            writing_task = Task(
                description=f"""Create a well-structured, engaging summary based on the research and analysis about: {prompt}
                
                The content should:
                - Be clear and accessible to a general audience
                - Include the most important findings and insights
                - Be well-organized with proper structure
                - Provide actionable takeaways
                
                Use the research and analysis from previous tasks.""",
                agent=self.writer_agent,
                expected_output="A well-written, structured summary that synthesizes the research and analysis",
                context=[research_task, analysis_task]
            )
            
            # Create and execute the crew
            crew = Crew(
                agents=[self.researcher_agent, self.analyst_agent, self.writer_agent],
                tasks=[research_task, analysis_task, writing_task],
                verbose=True
            )
            
            logger.info("Starting crew execution...")
            result = crew.kickoff()
            logger.info("Crew execution completed successfully")
            
            return str(result)
            
        except Exception as e:
            logger.error(f"Error in CrewAI processing: {str(e)}")
            raise e
