import { useState } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Textarea } from '@/components/ui/textarea.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Loader2, Bot, Users, Zap } from 'lucide-react'
import './App.css'

function App() {
  const [prompt, setPrompt] = useState('')
  const [result, setResult] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!prompt.trim()) return

    setIsLoading(true)
    setError('')
    setResult('')

    try {
      const response = await fetch('/api/crewai/process', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: prompt.trim() }),
      })

      const data = await response.json()

      if (data.success) {
        setResult(data.result)
      } else {
        setError(data.error || 'An error occurred while processing your request.')
      }
    } catch (err) {
      setError('Failed to connect to the server. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Bot className="h-8 w-8 text-blue-600" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              CrewAI + OpenAI Demo
            </h1>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Experience the power of collaborative AI agents working together using CrewAI and OpenAI integration.
            Enter a topic or question and watch our specialized agents research, analyze, and create comprehensive content.
          </p>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <Card className="text-center">
            <CardContent className="pt-6">
              <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <h3 className="font-semibold mb-1">Multi-Agent System</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Research, Analysis, and Writing agents collaborate
              </p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <Zap className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <h3 className="font-semibold mb-1">OpenAI Powered</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Leveraging GPT-4o-mini for intelligent processing
              </p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <Bot className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <h3 className="font-semibold mb-1">CrewAI Framework</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Orchestrated workflow with specialized roles
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Interface */}
        <div className="max-w-4xl mx-auto">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bot className="h-5 w-5" />
                AI Agent Collaboration
              </CardTitle>
              <CardDescription>
                Enter a topic, question, or task for our AI agents to process collaboratively
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Textarea
                    placeholder="Enter your prompt here... (e.g., 'Explain the benefits of renewable energy', 'Analyze the impact of AI on healthcare', 'Research the latest trends in web development')"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    className="min-h-[120px] resize-none"
                    disabled={isLoading}
                  />
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex gap-2">
                    <Badge variant="secondary">Research Agent</Badge>
                    <Badge variant="secondary">Analysis Agent</Badge>
                    <Badge variant="secondary">Writing Agent</Badge>
                  </div>
                  <Button 
                    type="submit" 
                    disabled={!prompt.trim() || isLoading}
                    className="min-w-[120px]"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      'Process Task'
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Results */}
          {(result || error || isLoading) && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {isLoading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Agents Working...
                    </>
                  ) : error ? (
                    <>
                      <Bot className="h-5 w-5 text-red-500" />
                      Error
                    </>
                  ) : (
                    <>
                      <Bot className="h-5 w-5 text-green-500" />
                      Agent Results
                    </>
                  )}
                </CardTitle>
                {isLoading && (
                  <CardDescription>
                    Our AI agents are researching, analyzing, and writing content for you...
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent>
                {isLoading && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                      <span className="text-sm text-gray-600">Research Agent gathering information...</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse animation-delay-200"></div>
                      <span className="text-sm text-gray-600">Analysis Agent processing data...</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse animation-delay-400"></div>
                      <span className="text-sm text-gray-600">Writing Agent creating content...</span>
                    </div>
                  </div>
                )}
                {error && (
                  <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                    <p className="text-red-700 dark:text-red-300">{error}</p>
                  </div>
                )}
                {result && (
                  <div className="prose dark:prose-invert max-w-none">
                    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border">
                      <pre className="whitespace-pre-wrap text-sm font-mono">{result}</pre>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-gray-500 dark:text-gray-400">
          <p className="text-sm">
            Powered by CrewAI framework and OpenAI API • Built with React and Flask
          </p>
        </div>
      </div>
    </div>
  )
}

export default App
