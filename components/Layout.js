import { Box, Circle, Flex, Text } from "@chakra-ui/react"

const Layout = ({ hasNavbar, children, pb }) => {
    return (
        <Box bgColor="#DADADA" minH="100vh" pb={pb} minW="100%">
            {hasNavbar &&
                <Box w="full" position="sticky" h="72px" backgroundColor="#A67399">
                    <Flex alignItems="center" justify="center" h="full">
                        <Text fontSize={{ base: "16px", md: "20px", lg: "24px" }} lineHeight={1.5} fontWeight="700" color="#FFFFFF">
                            Appraisal Form BEM Fakultas Psikologi UI
                        </Text>
                    </Flex>
                </Box>
            }
            <Box h="fit-content">
                {children}
            </Box>
        </Box>
    )
}

export default Layout